// Importing node.js file system module
const fs = require("fs");

class FileRepository {
    constructor(filename) {
        // Filename where datas are going to store
        if (!filename) {
            throw new Error("Filename is required to create a datastore!");
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);
        } catch (err) {
            // If file not exist
            // it is created with empty array
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async getRecords(attributes) {
        // Read filecontents of the datastore
        const jsonRecords = await fs.promises.readFile(this.filename, {
            encoding: "utf8",
        });

        // Parsing JSON records in JavaScript
        // object type records
        return JSON.parse(jsonRecords);
    }

    // Logic to add data
    async createNewRecord(attributes) {
        // Read filecontents of the datastore
        const jsonRecords = await fs.promises.readFile(this.filename, {
            encoding: "utf8",
        });

        // Parsing JSON records in JavaScript
        // object type records
        const objRecord = JSON.parse(jsonRecords);

        // Adding new record
        objRecord.push(attributes);

        // Writing all records back to the file
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(objRecord, null, 2)
        );

        return attributes;
    }
}

// The 'datastore.json' file created at
// runtime and all the information
// provided via signup form store in
// this file in JSON format.
module.exports = new FileRepository("datastore.json");
