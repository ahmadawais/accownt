import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

// Constants
import { XADS } from "../../constants/config";

export default class Ads extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			categories: [], searchResults: [], setCategories: [],
			error: false, message: "", info: ""
		};

		this.onSearchCategories = this.onSearchCategories.bind(this);
		this.onResetCategories = this.onResetCategories.bind(this);
		this.onAddCategory = this.onAddCategory.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onReset = this.onReset.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/ads",
			success: result => {
				// Set value of setCategories if user has categories set
				if (result.info != "") {
					let temp = JSON.parse(result.info);
					if (temp.categories)
						this.setState({setCategories: temp.categories});
				}
	
				// info
				this.setState(result);
				
				request({
					url: XADS + "api/pub/categories",
					success: result => {
						// categories
						this.setState(result);
					}
				});
			}
		});
	}
	
	onSearchCategories() {
		let results = [];
		
		this.state.categories.forEach(category => {
			let found = 0;
			
			if (category.indexOf(this.refs.category.value) != -1 && found < 5) {
				found++;
				results.push(category);
			}
		});
		
		this.setState({searchResults: results});
	}
	
	onAddCategory() {
		if (this.state.setCategories.indexOf(this.refs.category.value) == -1 && this.state.setCategories.length < 6) {
			this.setState({
				setCategories: this.state.setCategories.concat(this.refs.category.value)
			});
		}
	}
	
	onResetCategories() {
		this.setState({setCategories: []});
	}
	
	onUpdate() {
		const data = {
			categories: this.state.setCategories.join(","),
			keywords: this.refs.keywords.value,
			gender: this.refs.gender.value,
			age: this.refs.age.value
		};

		if (data.categories.length > 500)
			this.setState({error: true, message: "Too many categories provided"});
		else if (data.keywords.length > 250)
			this.setState({error: true, message: "Too many keywords provided"});
		else {
			request({
				url: "../api/dashboard/ads",
				data: data,
				method: "PUT",
				success: result => {
					// error, message
					this.setState(result);
				}
			});
		}
	}
	
	onReset() {
		const data = {
			categories: "", keywords: "", gender: "", age: ""
		};
	
		request({
			url: "../api/dashboard/ads",
			data: data,
			method: "PUT",
			success: result => this.setState(result)
		});
	}
	
	render() {
		let userAlert;
		
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		const i = this.state.info == "" ? "" : JSON.parse(this.state.info);
	
		const info = {
			age: i.age || "",
			gender: i.gender || "",
			keywords: i.keywords || ""
		};
		
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				<h3>Ad Profile</h3>
				<p>
					Your ad profile is utilized across the Xyfir Network to help serve you more personalized ads that you may be interested in.
					<br />
					If this is a feature you do not want to utilize, simply leave your ad profile blank.
				</p>
			
				{userAlert}
				
				<label>Age Range</label>
				<select ref="age" defaultValue={info.age}>
					<option value="1">18-24</option>
					<option value="2">25-34</option>
					<option value="3">35-44</option>
					<option value="4">45-54</option>
					<option value="5">55-64</option>
					<option value="6">65+</option>
				</select>
				
				<label>Gender</label>
				<select ref="gender" defaultValue={info.gender}>
					<option value="1">Male</option>
					<option value="2">Female</option>
					<option value="3">Other</option>
				</select>
				
				<label>Keywords</label>
				<small>
					A comma delimited list of keywords and phrases of things you"re interested in.
					<br />
					If you have to view ads, they might as well be of some interest to you.
				</small>
				<textarea ref="keywords" defaultValue={info.keywords}></textarea>
				
				<label>Categories</label>
				<small>Like keywords, select categories that interest you.</small>
				<input type="text" ref="category" onChange={this.onSearchCategories} />
				
				<div className="search-results">{
					this.state.searchResults.map(category => {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button type="primary btn-sm" onClick={this.onAddCategory}>Add</Button>
				<Button type="primary btn-sm" onClick={this.onResetCategories}>Reset</Button>
				
				<div className="categories">{
					this.state.setCategories.map(category => {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button onClick={this.onUpdate}>Update Profile</Button>
				<Button onClick={this.onReset}>Reset Profile</Button>
			</div>
		);
	}
	
}