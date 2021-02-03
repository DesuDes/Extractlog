# Extract Log
A tool to extract nightwatch test suites selenium logs into individual `.txt` files.

## Installation
1. install nodejs
2. Download the files or pull this repository.
3. Create an folder named `output` on the same directory.

## Usage
Run `node parse <source> -f <test_file>`

### Example

`node parse input\105.txt -f tests\sanity\SAN_Accounting.js`
`node parse input\105.txt -f tests\sanity\SAN_Accounting.js tests\sanity\SAN_Utilities.js`
`node parse input\105.txt -f tests\sanity\SAN_Accounting.js SAN_Utilities.js`
