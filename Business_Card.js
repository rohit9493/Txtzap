mport React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { API_ENDPOINT } from "./../../../utils/common";
import Image from "react-bootstrap/Image";
import { Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Validator from "validatorjs";
import { withRouter } from "react-router-dom";
toast.configure();

const Businessform = props => {
const [showLoading, setShowLoading] = useState(false);

const [formdata, setformdata] = useState({
user_id: "",
instagram: "",
youtube: "",
pinterest: "",
twitter: "",
facebook: "",
website: "",
sub_title: "",
designation: "",
profile1: "",
logo1: "",
style_id: "",
email: "",
name: "",
card_name: "",
address: "",
content: "",
phone: ""
});
const [stylelist, setstyleData] = useState([]);
const [userslist, setusersData] = useState([]);

const validateForm = () => {
let data = {
card_name: formdata.card_name,
content: formdata.content,
user_id: formdata.user_id,
instagram: formdata.instagram,
youtube: formdata.youtube,
twitter: formdata.twitter,
facebook: formdata.facebook,
website: formdata.website,
sub_title: formdata.sub_title,
designation: formdata.designation,
profile: formdata.profile1,
logo: formdata.logo1,
style_id: formdata.style_id,
email: formdata.email,
name: formdata.name,
address: formdata.address,
phone: formdata.phone,
pinterest: formdata.pinterest
};

let rules = {
name: "required",
email: "required|email",
card_name: "required",
content: "required",

designation: "required",
style_id: "required",
address: "required",
phone: "required",
website: "url|required",
pinterest: "url",
instagram: "url",
youtube: "url",
twitter: "url",
facebook: "url"
};

let validation = new Validator(data, rules);

if (validation.passes()) {
return true;
}
};

useEffect(() => {
setShowLoading(true);

const apiUrlstyle = API_ENDPOINT + "style_list/";
const getstyle = async () => {
const result = await axios(apiUrlstyle, {
headers: {
Authorization: localStorage.getItem("token")
}
});
setstyleData(result.data);
};
const apiUrlusers = API_ENDPOINT + "user_list";
const getuser = async () => {
const result = await axios(apiUrlusers, {
headers: {
Authorization: localStorage.getItem("token")
}
});
setusersData(result.data);
};

getstyle();
getuser();
setformdata(props.data);
setShowLoading(false);
document.body.classList.remove("tp-fp", "blue_bg", "review_bg");
}, [props.data]);

const handleChange = event => {
setformdata({ ...formdata, [event.target.id]: event.target.value });
};

const onDropprofile = acceptedFiles => {
let file = acceptedFiles[0];
let reader = new FileReader();

reader.readAsDataURL(file);

reader.onload = function() {
setformdata({ ...formdata, ["profile1"]: reader.result });
};

reader.onerror = function() {
console.log(reader.error);
};
};

const reset = () => {
var win = window.open("/businesscard/" + formdata.name, "_blank");
win.focus();
};

const onDroplogo = acceptedFiles => {
let file = acceptedFiles[0];

let reader = new FileReader();

reader.readAsDataURL(file);

reader.onload = function() {
setformdata({ ...formdata, ["logo1"]: reader.result });
};

reader.onerror = function() {
console.log(reader.error);
};
};

const formSubmit = async () => {
var postData = {
id: props.data.id,
card_name: formdata.card_name,
content: formdata.content,
user_id: localStorage.getItem("user_id"),
instagram: formdata.instagram,
youtube: formdata.youtube,
pinterest: formdata.pinterest,
twitter: formdata.twitter,
facebook: formdata.facebook,
website: formdata.website,
sub_title: formdata.sub_title,
designation: formdata.designation,
profile: formdata.profile1,
logo: formdata.logo1,
style_id: formdata.style_id,
email: formdata.email,
name: formdata.name,
address: formdata.address,
phone: formdata.phone
};

let axiosConfig = {
headers: {
"Content-Type": "application/json;charset=UTF-8",
Authorization: localStorage.getItem("token")
}
};
const apiadd = API_ENDPOINT + "bussiness_data/";
const apiedit = API_ENDPOINT + "bussiness_update";

if (props.data.id) {
axios
.post(apiedit, postData, axiosConfig)
.then(res => {
if (res.status === 202) {
toast(res.data.message);
} else {
toast(res.data.message);
props.history.push({
pathname: "/businesscardlist"
});
}
})
.catch(err => {
console.log("AXIOS ERROR: ", err);
});
} else {
axios
.post(apiadd, postData, axiosConfig)
.then(res => {
toast(res.data.message);
props.history.push({
pathname: "/businesscardlist"
});
})
.catch(err => {
console.log("AXIOS ERROR: ", err);
});
}
};

const back = () => {
props.history.push({
pathname: "/businesscardlist"
});
};
var name = "";
if (typeof props.data.id === "undefined" || props.data.id === null) {
name = " Add Business Card";
} else {
name = " Edit Business Card";
}

return (
<div>
<Form encType="multipart/form-data">
<div className="review">
<div className="row">
<div className="col-md-12">
<div className="card border-top-0 border-right-0 border-left-0 pb-4">
<div className="card-header bg-white ">
<div className="row">
<div className="col-md-6">
<h5 className="card-title mb-0 pt-2"> {name}</h5>
</div>
<div className="col-md-6 text-right">
<button
onClick={() => back()}
type="button"
className="btn btn-primary bg-white back-btn"
>
<i
className="fa fa-long-arrow-left"
aria-hidden="true"
/>{" "}
Back
</button>
<button
disabled={!formdata.id}
onClick={() => reset()}
type="button"
className="btn btn-secondary bg-white back-btn"
>
<i className="fa fa-cog" aria-hidden="true" />
Preview
</button>
<input
disabled={!validateForm()}
type="button"
onClick={() => formSubmit()}
value="Save"
className="btn custom-btn font-weight-bold"
/>
</div>
</div>
</div>
<div className="card-body">
<small>Please Save Updates to Preview</small>
<div id="introduction">
<div className="row">
<div className="form-group col-md-4 ">
<input
type="text"
name="card_name"
id="card_name"
className="form-control"
placeholder="Card Name"
value={formdata.card_name}
onChange={handleChange}
/>
<input
type="hidden"
name="id"
id="id"
className="form-control"
placeholder="id"
value={formdata.id}
/>
<label>Enter Business Card Title*</label>
</div>
<div className="form-group col-md-4 ">
<input
type="text"
className="form-control"
id="content"
name="content"
placeholder="Content"
value={formdata.content}
onChange={handleChange}
/>
<label>Enter Content* </label>
</div>
<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Unique Url"
id="name"
name="name"
value={formdata.name}
onChange={handleChange}
/>
<label>Unique Url*</label>
</div>
<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Email"
id="email"
name="email"
value={formdata.email}
onChange={handleChange}
/>
<label>Email*</label>
</div>
<div className="form-group col-md-4">
<select
className="form-control"
id="style_id"
name="style_id"
value={formdata.style_id}
onChange={handleChange}
>
<option value="">Please Select Style</option>
{stylelist.map((item, idx) => (
<option
selected={formdata.id == item.id}
key={idx}
value={item.id}
>
{item.name}
</option>
))}
</select>
<label>Style*</label>
</div>


<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Designation"
id="designation"
name="designation"
value={formdata.designation}
onChange={handleChange}
/>
<label>Designation*</label>
</div>

<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Sub Title"
id="sub_title"
name="sub_title"
value={formdata.sub_title}
onChange={handleChange}
/>
<label>Sub Title*</label>
</div>

<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Phone"
id="phone"
name="phone"
value={formdata.phone}
onChange={handleChange}
maxLength="10"
/>
<label>Phone*</label>
</div>

<div className="form-group col-md-4">
<input
type="text"
className="form-control"
placeholder="Address"
id="address"
name="address"
value={formdata.address}
onChange={handleChange}
/>
<label>Address*</label>
</div>

<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Website"
id="website"
name="website"
value={formdata.website}
onChange={handleChange}
/>
<label>
Website* (Ref link :https://www.facebook.com/)
</label>
</div>

<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Facebook"
id="facebook"
name="facebook"
value={formdata.facebook}
onChange={handleChange}
/>
<label>
Facebook (Ref link :https://www.facebook.com/)
</label>
</div>

<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Twitter"
id="twitter"
name="twitter"
value={formdata.twitter}
onChange={handleChange}
/>
<label>
Twitter (Ref link :https://www.facebook.com/)
</label>
</div>

<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Pinterest"
id="pinterest"
name="pinterest"
value={formdata.pinterest}
onChange={handleChange}
/>
<label>
Pinterest (Ref link :https://www.facebook.com/)
</label>
</div>

<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Youtube"
id="youtube"
name="youtube"
value={formdata.youtube}
onChange={handleChange}
/>
<label>
Youtube (Ref link :https://www.facebook.com/)
</label>
</div>
<div className="form-group col-md-4">
<input
type="url"
className="form-control"
placeholder="Instagram"
id="instagram"
name="instagram"
value={formdata.instagram}
onChange={handleChange}
/>
<label>
Instagram (Ref link :https://www.facebook.com/)
</label>
</div>
<div className="form-group col-md-4">
<Image
src={API_ENDPOINT + formdata.profile}
fluid
width="225"
className={
formdata.profile ? "image-padding" : "hidden"
}
/>
<Dropzone
onDrop={acceptedFiles => onDropprofile(acceptedFiles)}
>
{({ getRootProps, getInputProps }) => (
<section>
<div {...getRootProps()}>
<input
{...getInputProps()}
accept=".jpeg,.png,.jpg,.gif"
/>
<p className="btn btn-secondary">Select File</p>
</div>
</section>
)}
</Dropzone>
<label>
Profile{" "}
<small>Prefered Logo Size is (225 X 220)</small>
</label>
</div>
<div className="form-group col-md-4">
<Image
src={API_ENDPOINT + formdata.logo}
fluid
width="100"
className={formdata.logo ? "image-padding" : "hidden"}
/>
<Dropzone
onDrop={acceptedFiles => onDroplogo(acceptedFiles)}
>
{({ getRootProps, getInputProps }) => (
<section>
<div {...getRootProps()}>
<input
{...getInputProps()}
accept=".jpeg,.png,.jpg,.gif"
/>
<p className="btn btn-secondary">Select File</p>
</div>
</section>
)}
</Dropzone>
<label>
Logo <small>Prefered Logo Size is (100 X 50)</small>
</label>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/ <Footer /> /}
</Form>
</div>
);
};

export default withRouter(Businessform);
