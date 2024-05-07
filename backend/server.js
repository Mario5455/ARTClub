const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')

app.set('view engine', 'ejs')

app.use(express.static('frontend'))

app.use(expressLayouts)

let dataRead = (err, data) => {

	if (err) {
		console.error(err)
		return
	}

	const accounts = JSON.parse(data)
    const admins = accounts.admins
    const users = accounts.users

app.get(["/", "/createaccount"], (req, res) => {
    res.render("index")
})
app.get("/admins", (req, res) => {
    res.send(admins)
})
app.get("/users", (req, res) => {
    res.send(users)
})

}
fs.readFile('backend/accounts.json', 'utf8', dataRead);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})




