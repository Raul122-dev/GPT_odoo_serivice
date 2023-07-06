const functions_call = [
    {
        name: "search_in_google",
        description: "Search google with a given query, look for current information, information you don't know, only when needed.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The query to search in google",
                }
            },
            required: ["query"],
        },
    },
    {
        name: "consult_odoo_database",
        description: "Consult to database odoo with a given model, domain and fields, using the orm of odoo",
        parameters: {
            type: "object",
            properties : {
                model : {
                    type : "string",
                     description : "The model to search in the database",
                },
                domain : {
                    type : "string",
                    description : "The domain to search in the database, the domain is a list of tuples",
                },
                fields: {
                    type : "string",
                    description : "The fields to search in the database, the fields is a list of strings, eg. ['field1', 'field2']",
                },
                count : {
                    type : "integer",
                    description : "The count of the records to search in the database, default is 10",
                },
                order : {
                    type : "string",
                    description : "The order to search in the database, the order is a string with the field and the order",
                },
            },
            required : ["model", "domain", "fields", "count"],
        },
    },
    {
        name : "create_odoo_record",
        description : "Create a record to database odoo with a given model and values, using the orm of odoo",
        parameters : {
            type : "object",
            properties : {
                model : {
                    type : "string",
                    description : "The model to be used to create the record in odoo, in some models such as the product, the template is used e.g. 'product.template'.",
                },
                values : {
                    type : "string",
                    description : "The values to create in the database, the values is a dictionary with the fields and values",
                },
            },
            required : ["model", "values"],
        },
    },
    {
        name : "count_odoo_records",
        description : "Count records in the database for the given model and domain, using the odoo orm, this is only called when record quantities are requested.",
        parameters : {
            type : "object",
            properties : {
                model : {
                    type : "string",
                    description : "The model to be used to count the records in odoo, in some models such as the product, the template is used e.g. 'product.template'.",
                },
                domain : {
                    type : "string",
                    description : "The domain to search in the database, the domain is a list of tuples",
                },
            },
            required : ["model"],
        },
    },
]

export default functions_call;