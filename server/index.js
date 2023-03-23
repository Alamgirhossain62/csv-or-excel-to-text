const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!',
  });
});

app.post('/', upload.single('file'), async (req, res) => {
  try {
    const results = [];
    const fileRows = [];

    // Read uploaded file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => fileRows.push(data))
      .on('end', async () => {
        for (const row of fileRows) {
          const prompt = row.prompt;

          // Generate OpenAI response
          const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
          });

          results.push({ prompt, bot: response.data.choices[0].text });
        }

        // Send results to frontend
        res.status(200).send(results);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`AI server started on port ${port}`));
