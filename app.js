const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb+srv://paulzay:9W1eAfMLiK8U2gGx@devc-aoar3.azure.mongodb.net/test?retryWrites=true&w=majority')
    .then(()=>{
        console.log("connected successfully")
    })
    .catch((error) =>{
        console.log("unable to connect to mongodb")
        console.error(error)
    })

app.use((req, res,next) =>{
    res.setHeader('Access-Control-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST ,PUT ,DELETE, PATCH, OPTIONS');
    next();
})

app.use(bodyParser.json);

app.use('/api/recipes',(req, res, next) =>{
    const recipes = [
        {
            title: "pizza pie",
            ingredients: "flour, oil, salt, sugar, spice",
            instructions: "heat for one hour",
            difficulty: 2,
            time: 20,
            _id: "12245"
        },
        {
            title: "hamburger",
            ingredients: "flour, oil, salt, sugar, spice",
            instructions: "heat for three hours",
            difficulty: 4,
            time: 30,
            _id: "second"
        },
        {
        title: "doughnut",
        ingredients: "flour, oil, salt, sugar, spice",
        instructions: "dont mess it up",
        difficulty: 4,
        time: 100,
        _id: "third"
    }];
    res.status(200).json(recipes);
})

app.post('/api/recipes',(req, res, next) =>{
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
        _id: req.body._id
    })
    recipe.save().then(
        () => {
          res.status(201).json({
            message: 'Post saved successfully!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    })

//get recipes
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
      (recipes) => {
        res.status(200).json(recipes);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

//get one recipe
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
      _id: req.params.id
    }).then(
      (recipe) => {
        res.status(200).json(recipe);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
});
  
//UPDATE a recipe

app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
        _id: req.body._id
    })
  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () => {
      res.status(201).json({
        message: 'updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//DELETE a recipe

app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports = app;