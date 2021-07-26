const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

/*
const tableName = process.env.DYNAMODB_TABLE_NAME || 'movies-table';
insert above code below
*/


exports.handler = async (event, context) => {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const { data, success, statusCode } = await processDataTable(event);
    
    const bodyData = {
        data: data,
        success: success,
        // event
    };
    
    return {
        statusCode,
        body: JSON.stringify(bodyData),
        headers
    };
};

const processDataTable = async (event) => {
    let data;
    let success = false;
    let statusCode = '200';

    let queryParams = {
      "TableName" : tableName
    };

    let { httpMethod, year, movieName, director, ratings } = getBooksTableData(event);
    
    try {
        
        switch (httpMethod) {
            case 'DELETE':
                
                //delete code
                let delKeyData = {"year": year, "movieName": movieName};
                queryParams = { ...queryParams, "Key": delKeyData };

                data = await dynamo.delete( queryParams ).promise();
                break;

            case 'GET':
                //Read code
                data = await dynamo.scan( queryParams ).promise();
                break;

            case 'POST':
                
                // Create code
                let movieItems = {"year": year, "movieName": movieName };

                if( director ){
                    movieItems = { ...movieItems, "director": director };
                }

                if( ratings ){
                    movieItems = { ...movieItems, "ratings": ratings };
                }
                queryParams = { ...queryParams, "Item": movieItems };

                data = await dynamo.put(queryParams).promise();
            
                break;

            case 'PUT':
                
                //Edit code
                let keyData = {"year": year, "movieName": movieName};
                queryParams = { 
                  ...queryParams, 
                  "Key": keyData,
                  UpdateExpression: 'set director = :director, ratings = :ratings',
                  ExpressionAttributeValues: { ':director': director, ':ratings' :ratings }
                };
                
                data = await dynamo.update(queryParams).promise();
                break;

            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
        success = true;

    } catch (err) {
        statusCode = '400';
        console.log(err)
        success = false;
    } finally {}

    return { data, success, statusCode };
}

const getBooksTableData = (event) => {
    
    let year = "";
    let movieName = "";
    let director = null;
    let ratings = null;
    let httpMethod = "";
    
    if(event.httpMethod){
        
        httpMethod = event.httpMethod;
        let inputData = {};
        
        if(event.body){
            if( typeof event.body == "string"){
                inputData = JSON.parse(event.body);        
            }
            else{
                inputData = event.body;      
            }
        }
        
        if( inputData.releasedYear ){
            year = inputData.releasedYear;
        }

        if( inputData.movieName ){
            movieName = inputData.movieName;
        }

        if( inputData.director ){
            director =  inputData.director;
        } 

        if( inputData.ratings ){
            ratings =  inputData.ratings;
        } 
    }
   
    return { httpMethod, year, movieName, director, ratings};
}
