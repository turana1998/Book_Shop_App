const UsersModel=require('../models/users');



const addUser=async (req,passwordHash)=>{
    let body=req.body;
    var user=new UsersModel({
            name:body.name,
            surname:body.surname,
            email:body.email,
            password:passwordHash,
            passwordStr:body.password,
            is_active:true,
            photo:body.photo,
            roleId:body.roleId
    });
    let err=await user.save();
}


const getUsers=(req)=>{
    return UsersModel.find({is_active:true},'name surname photo email roleId').lean();
}

const getUserById=(userId)=>{
    return UsersModel.findById(userId,'name surname email ');
}

const updateUser=async(req)=>{
    let body=req.body;
    let currentUser=await UsersModel.findById(req.params.userId);
    currentUser.name=body.name;
    currentUser.surname=body.surname;
    currentUser.email=body.email;
    await currentUser.save();
}


const deleteUser=async (req)=>{
    let currentUser=await UsersModel.findById(req.params.userId);
    currentUser.is_active=false;
    await currentUser.save();
}

module.exports={
    addUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}

