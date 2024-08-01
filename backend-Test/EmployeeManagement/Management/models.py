from django.db import models

# Create your models here.
from django.db import models

# from cloudinary.models import CloudinaryField



# CloudinaryField('image')
class Employee(models.Model):
    EmployeeID = models.CharField(max_length=50,primary_key=True)
    photo = models.ImageField(upload_to='photos/', null=True, blank=True)
    name = models.CharField(max_length=100)
    DOB = models.DateField()
    lookup_field = 'EmployeeID'
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    Gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    NRC = models.CharField(max_length=50)
    Email = models.EmailField()
    Address = models.TextField()
    
    Skills = models.CharField(max_length=100)
    DEPARTMENT_CHOICES = [
        ('HR', 'HR'),
        ('Admin', 'Admin'),
        ('SDD', 'SDD'),
        ('Finance', 'Finance'),
    ]
    Department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES)
    
    # Education = models.ManyToManyField(Education,related_name='Education', blank=True)
    # Education, on_delete=models.CASCADE, related_name='Education', blank=True, null=True)
    fields = ['EmployeeID','photo','name','DOB','Gender','NRC','Email','Address','Skills','Department','Education']

    class Meta:
        db_table="Management_employee"
    def __str__(self):
        return self.EmployeeID
    

class Education(models.Model):
    employee = models.ForeignKey(Employee ,on_delete=models.CASCADE, related_name='Education', blank=True, null=True)
    
    Education_type = [
        ('Bachelor', 'Bachelor'),
        ('Master', 'Master'),
        ('Ph.D', 'Ph.D'),
        ('Certificate', 'Certificate'),
        ('Diploma', 'Diploma'),
    ]
    Type = models.CharField(max_length=20, choices=Education_type)
    
    Description = models.TextField()
    Year = models.PositiveIntegerField()
    
    def __str__(self):
        return self.Type