# Extract Log
A tool to extract nightwatch test suites selenium logs into individual `.txt` files.

## Installation
1. install nodejs
2. Download the files or pull this repository.
3. Create an folder named `output` on the same directory.

-------
## Parse.js
The module to extract log files from the pipeline.

### Source Files
1. Go to Pipelines, and Builds; Go to automation folder then Selenium Grid.
2. Select any build.
3. Go to pipeline - Step: Run Tests and Compile Results; download the .zip of the npm run.
4. Use the log and use it as a source file.
5. Indicate the file name of the test/test suite.

#### Example

`node parse input\105.txt -f tests\sanity\SAN_Accounting.js`

`node parse input\105.txt -f tests\sanity\SAN_Accounting.js tests\sanity\SAN_Utilities.js`

`node parse input\105.txt -f tests\sanity\SAN_Accounting.js SAN_Utilities.js`

### Usage
Run `node parse <source_file> -f <test_file>...`


