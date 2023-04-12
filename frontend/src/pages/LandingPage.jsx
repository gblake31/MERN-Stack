import React, {useState, useContext, useEffect} from 'react';
import ItemList from '../components/ItemList';
import {UserContext} from '../App'
import imageCompression from 'browser-image-compression';



function LandingPage(props){
	let {loggedIn, setLoggedIn} = useContext(UserContext);

	let [ready, setReady] = useState(false);
	let [myimg, setmyimg] = useState("");

	let bp = require('../components/Leinecker/Path.js');

	let sid;
    let item;
    let pr;
    let desc;
    let cond;
	let f;

	const toBase64 = file => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
	 

	const callAPI = async event =>
	{
		event.preventDefault();
		let imgFile = f.files[0];

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

		let imgstr = await toBase64(compressedFile);
		let local = JSON.parse(localStorage.getItem('user_data'));
		let obj = {sellerid: local.id, itemname: item.value, price: pr.value, description: desc.value, condition: cond.value, image:imgstr, listedtime: "0"}
		let js = JSON.stringify(obj);
		// DISPLAYS BASE64 IMAGE
		setmyimg(imgstr);
		try {
			const response = await fetch(bp.buildPath('api/createItem'),
			{method: 'POST', body:js, headers:{'Content-Type': 'application/json'}});
			let res = JSON.parse(await response.text());
			if (res.error == '') {
				console.log("success");
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

	useEffect(() => {
		const doSearch = async (str) => {
		  let obj = {search: str};
		  let js = JSON.stringify(obj);
		  try {
			const response = await fetch(bp.buildPath('api/searchItems'), {
			  method: 'POST',
			  body: js,
			  headers: {'Content-Type': 'application/json'}
			});
			let res = JSON.parse(await response.text());
			if (res.error === '') {
			  console.log('success');
			  props.updateList(res.results);
			} else {
			  console.log(res.error);
			}
		  } catch(e) {
			alert(e.toString());
			return;
		  }
		}
		doSearch('');
	}, []);

	return (
		<div id = "page">
			<main>
				<div className="Listing">
					<h2>Listings:</h2>
				</div>
				<ItemList arr = {props.itemList}/>
				<div className="section section2">
					<h1>Add an Item to the Database (This is very Temporary)</h1>
					<label>itemname:</label>
					<input type = "text" ref={(c) => item = c}></input>
					<label>price:</label>
					<input type = "text" ref={(c) => pr = c}></input>
					<label>description:</label>
					<input type = "text" ref={(c) => desc = c}></input>
					<label>condition:</label>
					<input type = "text" ref={(c) => cond = c}></input>
					<label>file</label>
					<input type = "file" ref={(c) => f = c }></input>
					<img src = {myimg}></img>
					<button onClick= {callAPI}>Add to Database</button>
				</div>
			</main>
		</div>
	);
}

export default LandingPage;