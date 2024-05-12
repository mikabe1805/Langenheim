const { GoogleSpreadsheet } = require('google-spreadsheet');
var {google} = require('googleapis');
// File handling package
const fs = require('fs');
const { INSPECT_MAX_BYTES } = require('buffer');
const RESPONSES_SHEET_ID = '1xwhYVhmQjnEZsFlsUqqb4ejq_DZcFXsNzW1F8RLNgfk'; //Artwork 2
//const RESPONSES_SHEET_ID = '11dCOw0eFFKVXmPo1alL-G006VF7_xHL0VLrYNVsnkGM'; //Artwork 1


const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
// Credentials for the service account
const CREDENTIALS = JSON.parse(fs.readFileSync('./credentials.json'));
var maxID;

const getServerSide = async() => {
  const auth = await google.auth.getClient({scopes: ['https://www.googleapis.com/auth/spreadsheets']});
  const sheets = google.sheets({ version: 'v4', auth });
}

function formatTags(tags){
  return (tags.trim()).split(',');
}

function containsID(jsonObj, ID){
  let contains = false;
  jsonObj.forEach(artwork => {
    if(artwork['art_id'] === ID){
      contains = true;
    }
  });

  return contains;
}



sortByCriteria = async (artworkList, criteria) => {
  let returnArtwork;
  if(criteria === "art_title"){
    returnArtwork = artworkList.sort(function (a, b) {
    return a.art_title.localeCompare(b.art_title);
    });
  }

  else if(criteria === "art_creator"){
    returnArtwork = artworkList.sort(function (a, b) {
    return a.art_creator.localeCompare(b.art_creator);
    });
  }

  return returnArtwork;
}

function containsTag(tag, tag_list){
  tag = (tag.toLowerCase()).trim();
  let returnVale = false;

  for(i = 0; i < tag_list.length; i++){
    if(tag === (tag_list[i].toLowerCase()).trim()){
      return true;
    }
  }

  return returnVale;
}

// SuperSecretFunction = async() => {
//   await doc.useServiceAccountAuth({
//     client_email: CREDENTIALS.client_email,
//     private_key: CREDENTIALS.private_key
//   });
//   await doc.loadInfo();
//   let sheet = doc.sheetsByIndex[0];
//     let tags = [];
//     let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

//     let rows = await sheet.getRows();
//     let jsonObj = [];
//     maxID = rows.length;
//     for (let index = 0; index < rows.length; index++) {
//         var row = rows[index];
//         if(row.Valid === "TRUE"){
//             artsourcelink = row.Upload_Artwork;
//             imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
//             imageId = imageId.substr(1);
//             var file = DriveApp.getFileById(imageId);
//             Logger.log(file);
//             var docName = file.getName();
//             var docSize = file.getSize();
//             var docType = file.getMimeType();

//             var docImg = Utilities.base64Encode(file.getBlob().getBytes());
//             Logger.log(docImg);
//         }
//       }

// }

module.exports.getRandomArtwork = async () => {
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });

// load the documents info
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];
  let tags = [];
  let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

  let rows = await sheet.getRows();
  let jsonObj = [];
  let maxID = rows.length;
  let id = Math.floor(Math.random() * maxID);
  while (id==69) { // invalid
    id = Math.floor(Math.random() * maxID);
  }
  id = "" + id;
  console.log(id);
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if(row.Valid === "TRUE"){
      if(row.ID === id){
        item = {};
        item ["art_title"] = row.Artwork_Name;
        item ["art_creator"] = row.Artist_Name;
        item ["art_description"] = row.Description;
        item ["grad_year"] = row.Class;
        // item ["art_source"] = row.Upload_Artwork;
        //test other source of art
        artsourcelink = row.Upload_Artwork;
        //baseUrl = "https://drive.google.com/uc?id";
        baseUrl="https://lh3.google.com/u/0/d/";
        imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
        imageId = imageId.substr(1);
        // url = baseUrl.concat(imageId); // problem: adds =
        url = baseUrl + imageId;
        item ["art_source"] = url;
        item ["art_id"] = row.ID;
        item ["art_type"] = row.Media_Format;
        item ["art_tags"] = formatTags(row.Tags);
        item ["row_number"] = row._rowNumber;

        return item;
      }
    }
  };
  console.log("wasnt found");
  return null;
};

module.exports.getAllArtwork = async (data) => {
    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];
    let tags = [];
    let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

    let rows = await sheet.getRows();
    let jsonObj = [];
    maxID = rows.length;
    for (let index = 0; index < rows.length; index++) {
        var row = rows[index];
        if(row.Valid === "TRUE"){
            item = {};
            item ["art_title"] = row.Artwork_Name;
            item ["art_creator"] = row.Artist_Name;
            item ["art_description"] = row.Description;
            item ["grad_year"] = row.Class;
            artsourcelink = row.Upload_Artwork;
            //baseUrl = "https://drive.google.com/uc?id";
            baseUrl="https://lh3.google.com/u/0/d/";
            imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
            imageId = imageId.substr(1);
            // url = baseUrl.concat(imageId); // problem: adds =
            url = baseUrl + imageId;
            item ["art_source"] = url;
            item ["art_id"] = row.ID;
            item ["art_type"] = row.Media_Format;
            item ["art_tags"] = formatTags(row.Tags);
            item["art_tags"].forEach(function (tag){
            if(!containsTag(tag, tags)){
                tags.push(tag);
            }
            });
            item ["row_number"] = row._rowNumber;

            if(!(containsID(jsonObj, row.ID))){
              jsonObj.push(item);
            }
        }

    };
    return {artwork: jsonObj, tags: tags};
};

const imageUrlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

module.exports.getArtwork = async (id) => {
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });

// load the documents info
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];
  let tags = [];
  let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

  let rows = await sheet.getRows();
  let jsonObj = [];
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if(row.Valid === "TRUE"){
      if(row.ID === id){
        item = {};
        item ["art_title"] = row.Artwork_Name;
        item ["art_creator"] = row.Artist_Name;
        item ["art_description"] = row.Description;
        item ["grad_year"] = row.Class;
        // item ["art_source"] = row.Upload_Artwork;
        //test other source of art
        artsourcelink = row.Upload_Artwork;
        //baseUrl = "https://drive.google.com/uc?id";
        baseUrl="https://lh3.google.com/u/0/d/";
        imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
        imageId = imageId.substr(1);
        // url = baseUrl.concat(imageId); // problem: adds =
        url = baseUrl + imageId;
        item ["art_source"] = url;
        item ["art_id"] = row.ID;
        item ["art_type"] = row.Media_Format;
        item ["art_tags"] = formatTags(row.Tags);
        item ["row_number"] = row._rowNumber;

        return item;
      }
    }
  };
  
  return null;
};

module.exports.getJSON = async () => {
    return await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=q2F9PQBomDeWf3ZIGpd5Ld-zc2uM99uVPlfHFyXC-IL1wZ7bvPuRxpSax83748WAiKmcxKbBCnwWSkYyWDa8lrNkZJ7hy7wgm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnAUx8_M4mumCL5sQiZ0wwgrQ6fycNegbWeN0xWgdkOkJBWqmsTiLGZg_8a8XnHsREoiIvu6nb_-mz5yylK5aGsYk9Tl0-xeNeA&lib=MapPpBtNttTVeU4fydvpN6JhG3lFpo0w5')
    .then(function (response) {
        switch (response.status) {
            // status "OK"
            case 200:
                return response.text();
                console.log("#1" + content);
                // return content;
            case 404:
                throw response;
        }
    })
    .then(function (template) {
        console.log("hi?" + template);
        return template;
    }) // dont need maybe
    .catch(function (response) {
        // "Not Found"
        console.log("heyyyy thereeee" + response.statusText);
    });
  //   content.then(function(result) {
  //     // console.log(result) // "Some User token"
  //     // return result;
  //  });
  //  console.log("hello? " + content);
  //  return returnValue;
}

module.exports.getArtwork2 = async (Artist_Name) => {
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });

  // load the documents info
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];
  let tags = [];
  let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

  let rows = await sheet.getRows();
  let jsonObj = [];
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
    if(row.Valid === "TRUE"){
      if(row.Artist_Name === Artist_Name){
        item = {};
        item ["art_title"] = row.Artwork_Name;
        item ["art_creator"] = row.Artist_Name;
        item ["art_description"] = row.Description;
        item ["grad_year"] = row.Class;
        // item ["art_source"] = row.Upload_Artwork;
        //test other source of art
        artsourcelink = row.Upload_Artwork;
        // baseUrl = "https://drive.google.com/uc?id";
        baseUrl="https://lh3.google.com/u/0/d/";
        imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
        imageId = imageId.substr(1);
        // url = baseUrl.concat(imageId); // problem: adds =
        url = baseUrl + imageId;
        item ["art_source"] = url;
        item ["art_id"] = row.ID;
        item ["art_type"] = row.Media_Format;
        item ["art_tags"] = formatTags(row.Tags);
        item ["row_number"] = row._rowNumber;

        //return item;
        if(!(containsID(jsonObj, row.ID))) {
          jsonObj.push(item);
        }
      }
    }
  };
  
  //return null;
  // if(jsonObj == null) {
  //   console.log("null");
  // } else {
  //   console.log("im cool");
  // }
  return jsonObj;
}

// This system exports all artworks regardless of whether or not they are valid (to ensure a non messed up id system)
module.exports.getArtwork3 = async () => {
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key
  });

  // load the documents info
  await doc.loadInfo();

  let sheet = doc.sheetsByIndex[0];
  let tags = [];
  let SKIP_TAGS = ["Freshman", "Sophomore", "Junior", "Senior"]

  let rows = await sheet.getRows();
  let jsonObj = [];
  for (let index = 0; index < rows.length; index++) {
    var row = rows[index];
        item = {};
        item ["art_title"] = row.Artwork_Name;
        item ["art_creator"] = row.Artist_Name;
        item ["art_description"] = row.Description;
        item ["grad_year"] = row.Class;
        // item ["art_source"] = row.Upload_Artwork;
        //test other source of art
        artsourcelink = row.Upload_Artwork;
        // baseUrl = "https://drive.google.com/uc?id";
        baseUrl="https://lh3.google.com/u/0/d/";
        imageId = artsourcelink.substr(32, 34); //this will extract the image ID from the shared image link
        imageId = imageId.substr(1);
        // url = baseUrl.concat(imageId); // problem: adds =
        url = baseUrl + imageId;
        // url = imageUrlToBase64(url);
        item ["art_source"] = url;
        item ["art_id"] = row.ID;
        item ["art_type"] = row.Media_Format;
        item ["art_tags"] = formatTags(row.Tags);
        item ["row_number"] = row._rowNumber;

        //return item;
        if(!(containsID(jsonObj, row.ID))) {
          jsonObj.push(item);
      }
  };
  
  //return null;
  // if(jsonObj == null) {
  //   console.log("null");
  // } else {
  //   console.log("im cool");
  // }
  return jsonObj;
}