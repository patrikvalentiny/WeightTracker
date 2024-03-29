﻿using System.ComponentModel.DataAnnotations;

namespace service.Models;

public class WeightInputCommandModel
{
    [Range(20, 500)] public required decimal Weight { get; set; }
    [Required] public required DateTime Date { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? SkeletalMuscleWeight { get; set; }
}