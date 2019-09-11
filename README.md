# ion-backend
Created by using Node.js(10.15.3) with Express(^4.17.1)

#How to run the app
1. clone the project
2. create .env file root of the project folder and add PORT, CONNECTION_STRING(mongodb database connection string)
3. npm i
4. npm start

#npm packages used
1. express.js, for create express app
2. http, for create http service
3. socket.io, for using the features of socket
4. multer, for upload and save file
5. mongoose, for use mongodb
6. cors, for allow cors-origin
7. dotenv, for use of .env file

#File description

main.js: Root file for start your server

app/socket_connection.js: for configure the socket and all socket functions for the app

app/models Folder, for schema
app/models/thermometer.js: have schema defination for thermometers collection
app/models/year_details.js: have schema defination for year details of each thermometer

app/app_config Folder for configure your app before start
app/app_config/db.js: for database connection
app/app_config/model.js: for configure your mongodb collection for use
app/app_config/route.js: for configure your route
app/app_config/index.js: for configure all of those features for your app and make everything ready for use

app/controller.js: have all the functions(handler) for each route
app/helper.js: have some function to help others, like readDataFromFile, analyticsProcess, updateOrAddFile etc.

upload Folder, will contains upload thermometr(json file) and output(output_file.json) file locally for temporary

