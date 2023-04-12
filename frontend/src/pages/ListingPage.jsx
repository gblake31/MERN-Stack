import React, {useState} from 'react';
import imageCompression from 'browser-image-compression';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function ListingPage() {

    let storageStr = localStorage.getItem('item');
    let listing = storageStr.length == 0 ? null : JSON.parse(storageStr);
    let [itemPic, setItemPic] = useState("");
    let bp = require('../components/Leinecker/Path.js');

    let imageRef;
    let nameRef;
    let priceRef;
    let descriptionRef;
    let conditionRef;
    let category;

    function _onSelect (option) {
        console.log('You selected ', option.label);
        category = option.value;
    }

    const options = [
        {value: 0, label: "None"},
        {value: 1, label: "Games"},
        {value: 2, label: 'Consoles'},
        {value: 3, label: 'Controllers'},
        {value: 4, label: 'Keyboards/Mice'},
        {value: 5, label: 'Audio'},
        {value: 6, label: 'Other'}
    ];
    const defaultOption = options[0];

    if (listing != null) setItemPic(listing.image);

    async function uploadImage() {
        let imgFile = imageRef.files[0];
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800
        }
        let compressedFile;
        try {
          compressedFile = await imageCompression(imgFile, options);
        } catch (error) {
          console.log(error);
          return;
        }
  
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
  
        let imgstr = await toBase64(compressedFile);
        setItemPic(imgstr);
    }

    const callAPI = async event =>
	{
		event.preventDefault();
        console.log(category);
	
		let local = JSON.parse(localStorage.getItem('user_data'));
		let obj = {sellerid: local.id, itemname: nameRef.value, price: priceRef.value, description: descriptionRef.value, condition: conditionRef.value, image:itemPic, category: category, listedtime: "0"}
		let js = JSON.stringify(obj);
		try {
			const response = await fetch(bp.buildPath('api/createItem'),
			{method: 'POST', body:js, headers:{'Content-Type': 'application/json'}});
			let res = JSON.parse(await response.text());
			if (res.error == '') {
				console.log("success");
                window.location.href = "/profile";
			}
			else {
				console.log(res.error);
			}
		}
		catch(e) {
			alert(e.toString());
			return;
		}
	}

    return (
        <div>
            <h1>{listing == null ? "Create New Listing" : "Edit Listing"}</h1>
            <img id = 'profile-pic' src = {itemPic}></img>
            <input type = "file" onChange = {uploadImage} ref={(c) => imageRef = c}></input>
            <div id = 'input-fields'> 
                <div className='input-box'>
                    <label id = "Text" >Item Name:</label>
                    <input defaultValue = {listing == null ? "" : listing.itemname} className = "field" type = "text"  ref={(c) => nameRef = c}></input>
                </div>
                <div className='input-box'>
                    <label id = "Text" >Description:</label>
                    <textarea className = "field" rows = '5' ref={(c) => descriptionRef = c} 
                    placeholder = 'Description' defaultValue={listing == null ? "" : listing.description}></textarea>
                </div>
                <div className='input-box'>
                    <label id = "Text" >Price:</label>
                    <input className = "field" type = "text" ref={(c) => priceRef = c} 
                    placeholder = 'Price' defaultValue={listing == null ? "" : listing.price}></input>
                </div>
                <div className='input-box'>
                    <label id = "Text" >Condition:</label>
                    <input className = "field" type = "text" ref={(c) => conditionRef = c} 
                    placeholder = 'Condition' defaultValue={listing == null ? "" : listing.condition}></input>
                </div>
                <div className='input-box' id = "categorySelect">
                    <label id = "Text" >Select a Category:</label>
                    <Dropdown options={options} onChange={_onSelect} placeholder="Select a Category"/>
                </div>
                <button onClick = {callAPI}>Confirm New Listing</button>  
            </div>
        </div>
    ) 
}

export default ListingPage;