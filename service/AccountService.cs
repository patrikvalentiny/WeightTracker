﻿using infrastructure.DataModels;
using infrastructure.Repositories;
using Serilog;
using service.Models;
using service.Password;

namespace service.Services;

public class AccountService(IRepository<User> _userRepository,
    PasswordRepository passwordRepository)
{
    public User? Authenticate(LoginCommandModel model)
    {
        try
        {
            var passwordHash = passwordRepository.GetByEmail(model.Email);
            var hashAlgorithm = PasswordHashAlgorithm.Create(passwordHash.Algorithm);
            var isValid = hashAlgorithm.VerifyHashedPassword(model.Password, passwordHash.Hash, passwordHash.Salt);
            if (isValid) return _userRepository.GetById(passwordHash.UserId);
        }
        catch (Exception e)
        {
            Log.Error("Authenticate error: {Message}", e);
        }

        return null;
    }

    public User Register(RegisterCommandModel model)
    {
        var hashAlgorithm = PasswordHashAlgorithm.Create();
        var salt = hashAlgorithm.GenerateSalt();
        var hash = hashAlgorithm.HashPassword(model.Password, salt);
        var user = _userRepository.Create(new User()
        {
            Username = model.Username,
            Email = model.Email,
            Firstname = model.Firstname,
            Lastname = model.Lastname,
        });
        passwordRepository.Create(user.Id, hash, salt, hashAlgorithm.GetName());
        return user;
    }
    
    // public User? Get(SessionData data)
    // {
    //     return _userRepository.GetById(data.UserId);
    // }
}