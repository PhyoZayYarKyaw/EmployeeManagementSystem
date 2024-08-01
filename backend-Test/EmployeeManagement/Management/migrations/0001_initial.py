# Generated by Django 5.0.6 on 2024-07-31 10:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('EmployeeID', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='photos/')),
                ('name', models.CharField(max_length=100)),
                ('DOB', models.DateField()),
                ('Gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=6)),
                ('NRC', models.CharField(max_length=50)),
                ('Email', models.EmailField(max_length=254)),
                ('Address', models.TextField()),
                ('Skills', models.CharField(max_length=100)),
                ('Department', models.CharField(choices=[('HR', 'HR'), ('Admin', 'Admin'), ('SDD', 'SDD'), ('Finance', 'Finance')], max_length=20)),
            ],
            options={
                'db_table': 'Management_employee',
            },
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Type', models.CharField(choices=[('Bachelor', 'Bachelor'), ('Master', 'Master'), ('Ph.D', 'Ph.D'), ('Certificate', 'Certificate'), ('Diploma', 'Diploma')], max_length=20)),
                ('Description', models.TextField()),
                ('Year', models.PositiveIntegerField()),
                ('employee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Education', to='Management.employee')),
            ],
        ),
    ]
