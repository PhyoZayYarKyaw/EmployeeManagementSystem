from rest_framework import serializers
from .models import Employee, Education

import json
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('Type', 'Description', 'Year')


    
class EmployeeSerializer(serializers.ModelSerializer):
    Education = EducationSerializer(many=True, required=False)
    # photo = serializers.ImageField()
    class Meta:
        model = Employee
        fields = ['EmployeeID', 'photo', 'name', 'DOB', 'Gender', 'NRC', 'Email', 'Address', 'Skills', 'Department', 'Education']

    # def create(self, validated_data):
    #     educations_data = validated_data.pop('Education',[])
    #     employee = Employee.objects.create(**validated_data)
    #     for education_data in educations_data:
    #         Education.objects.create(employee=employee, **education_data)
    #     return employee

class ImportSerializer(serializers.Serializer):
    file = serializers.FileField()