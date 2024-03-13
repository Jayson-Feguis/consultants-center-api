import fs from 'fs'

const env = process.env.NODE_ENV

const updateEnv = async () => {
  try {

    const data = await readFile(`.env.${env}.example`)

    if (checkFileIfExist(`.env`)) {

      await overwriteFile(`.env`, data)
    }

    else {

      await createFile(`.env`)

      await overwriteFile(`.env`, data)

    }

  } catch (error) {

    console.log(error);

  }
};


const readFile = async (file) => {

  const data = await fs.promises.readFile(file, 'utf8');

  return data;

};

const overwriteFile = async (file, content) => {

  try {

    const data = content

    await fs.promises.writeFile(file, data, 'utf8');

    console.log(`File '${file}' has been overwritten.`);

  } catch (error) {

    console.error(error);

  }
};

const checkFileIfExist = async (file) =>
  new Promise((resolve, reject) => {

    fs.access(file, fs.constants.F_OK, (err) => {

      if (err) {

        resolve(false);

      } else {

        resolve(true);

      }

    });

  });

const createFile = async (file) =>
  new Promise((resolve, reject) => {

    const dataAsString = JSON.stringify('{}', null, 2);

    fs.writeFile(file, dataAsString, (err) => {

      if (err) resolve(false);

      resolve(true);

    });

  });

updateEnv();