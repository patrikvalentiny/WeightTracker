﻿namespace service.Models;

public class BmiCommandModel
{
    public required decimal Bmi { get; set; }
    public required DateTime Date { get; set; }
    public required string Category { get; set; }
}