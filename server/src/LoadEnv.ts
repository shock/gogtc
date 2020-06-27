import dotenv from 'dotenv';
import commandLineArgs, { CommandLineOptions } from 'command-line-args';

// Setup command line options

let options:CommandLineOptions

try {
  options = commandLineArgs(
    [
      {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String,
      },
    ],
    {
      stopAtFirstUnknown: false
    }
  );
} catch (err) {
  options = {
    env: process.env.NODE_ENV
  }
}

// Set the env file
const result2 = dotenv.config({
  path: `./env/${options.env}.env`,
});

if (result2.error) {
  throw result2.error;
}
