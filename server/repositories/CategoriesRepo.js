const CategoriesModel=require('../models/categories');

const getCategories= async (req)=>{
    let categories=await CategoriesModel.find({is_active:true},"name");
    return categories;
}


const addCategory= async (req)=>{
    var category=new CategoriesModel({
        name:req.body.name,
        is_active:true
    });

    let err=await category.save();
}


const deleteCategory= async (req)=>{

    var category=CategoriesModel.findById({is_active:true,_id:req.params.categoryId});
    console.log(category);
    category.is_active=false;
    await category.save();
}


module.exports={
    getCategories,
    addCategory,
    deleteCategory
}