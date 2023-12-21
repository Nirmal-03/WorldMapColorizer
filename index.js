import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app=express();
const port=4100;

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"))

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"niranjan",
    port:5432
});
db.connect();

async function checkedvisit(){
    let result=await db.query("SELECT * FROM visited_country")
    result.rows.forEach((country)=>{
        countries.push(country.country_code);
    });
    return countries;
}

let countries=[];
app.get("/",async(req,res)=>{
    const countries=await checkedvisit();
    res.render("page",{
        countrys:countries,
        total:countries.length
    })
})

app.post("/submit",async(req,res)=>{
    let country=req.body.countryname;
    try{
        let codes=await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",[country.toLowerCase()]);
        let codeof=codes.rows[0];
        let codescoun=codeof.country_code;
        try{
            await db.query("INSERT INTO visited_country (country_code) VALUES ($1)",[codescoun]);
            res.redirect("/");
        }
        catch(err){
            const countries=await checkedvisit();
            res.render("page",{
                countrys:countries,
                total:countries.length,
                error:"country is already added.try again"
            })
        }
    }
    catch(err){
        const countries=await checkedvisit();
        res.render("page",{
            countrys:countries,
            total:countries.length,
            error:"the country name does not exist"
        })
    }

})

app.listen(port,()=>{
    console.log(`the server is running on port ${port}.`)
})

