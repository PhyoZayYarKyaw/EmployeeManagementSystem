from rest_framework import serializers    
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics
from .models import Employee, Education
from .serializers import EmployeeSerializer, EducationSerializer
import json


class EmployeeList(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    # lookup_field = "EmployeeID"

class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field="EmployeeID"

    def create(self, request, *args, **kwargs):
        print(request.data)
        
        profile_image = request.FILES.get("photo",None)
        validated_data = request.data.copy()
        validated_data['photo'] = profile_image
        education_data = request.data.get('Education', '[]')
        print(validated_data)
        print("Education data",education_data)
        employee_serializer = self.get_serializer(data=validated_data)
        
                
                
        if employee_serializer.is_valid():
            employee = employee_serializer.save()
            print((education_data))
            if len(education_data) > 0 :
                for edu_data in education_data:                    
                    edu_serializer = EducationSerializer(data=edu_data)
                    if edu_serializer.is_valid():
                        education = edu_serializer.save()
                        employee.Education.add(education)
                    
            return Response(employee_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(employee_serializer.errors)
            return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeUpdateViewSet(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field="EmployeeID"                      

    def update(self, request, *args, **kwargs):
    
        instance = self.get_object()
        mutable_data = request.data.copy()
        # print(mutable_data)
        
        profile_image = request.FILES.get("photo",None)
        # validated_data = request.data.copy()
        mutable_data['photo'] = profile_image
        
        # Check if photo field is present in request.FILES
        instance.DOB = mutable_data.get('DOB',instance.DOB)
        instance.NRC = mutable_data.get('NRC', instance.NRC)
        instance.Skills = mutable_data.get('Skills',instance.Skills)
        instance.name = mutable_data.get('name', instance.name)
        instance.Email = mutable_data.get('Email', instance.Email)
        instance.Address = mutable_data.get('Address', instance.Address)
        instance.Department = mutable_data.get('Department', instance.Department)
        instance.Gender = mutable_data.get('Gender', instance.Gender)
        instance.skills = mutable_data.get('Skills', instance.Skills)
        instance.save()
        education_data_str = request.data.get('Education', '[]')
        print("Validate data ",mutable_data)
        
        employee_serializer = self.get_serializer(data=mutable_data, partial=True)

        employee_serializer = self.get_serializer(instance, data=mutable_data, partial=True)
        
        if employee_serializer.is_valid():
            # Handle photo update separately if present in request
            instance.save()
            print("Update ")
            if profile_image:
                instance.photo = profile_image
                instance.save()
            
            # Save the updated employee instance
            # employee.save()
            
            # Clear existing education associations and add new ones
            instance.Education.clear()
            education_data=json.loads(education_data_str)
            print("Edu data : ",education_data)
            for edu_data in education_data:
                print("Edu data ",edu_data)
                # edu_data["Year"] = int(edu_data["Year"])
                edu_serializer = EducationSerializer(data=edu_data)
                if edu_serializer.is_valid():
                    education = edu_serializer.save()
                    instance.Education.add(education)
                else:
                    print(edu_serializer.errors)
                    raise serializers.ValidationError(edu_serializer.errors)
                
            return Response(employee_serializer.data, status=status.HTTP_200_OK)
            
            # return Response(employee_serializer.data)
        else:
            print(employee_serializer.errors)
            return Response(employee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .serializers import ImportSerializer
from openpyxl import load_workbook   
from rest_framework.parsers import MultiPartParser,FormParser
import pandas as pd

class ImportAPIView(APIView):
    serializer_class = ImportSerializer
    parser_classes = [MultiPartParser,FormParser]

    def post(self,request):
        try:
            data = request.FILES
            serializer =self.serializer_class(data=data)
            if not serializer.is_valid():
                return Response({'status' : False,'message' : 'Provide a valid file'},status=status.HTTP_400_BAD_REQUEST)
            excel_file = data.get('file')
            df = pd.read_excel(excel_file,sheet_name=0)
            print(df)
            for index,row in df.iterrows():
                # print ( row)
                
                EmployeeID =row['EmployeeID']
                print(EmployeeID)
                if Employee.objects.filter(EmployeeID = EmployeeID).exists():
                        employee = Employee.objects.get(EmployeeID=EmployeeID)
                        print("Employee is : " , employee)
                        
                        Education.objects.create(
                                employee = employee,
                                Type =row['Type'],
                                Description =row['Description'],
                                Year =row['Year'])
                else :
                        print("Employee don't exist")
                        employee = Employee.objects.create(
                            EmployeeID =EmployeeID,
                            name =row['Name'],
                            DOB =row['DOB'],
                            Gender =row['Gender'],
                            NRC =row['NRC'],
                            Email =row['Email'],
                            Address =row['Address'],
                            Skills =row['Skills'],
                            Department =row['Department'])
                        # employee.save()
                        print(f"Employee with ID {EmployeeID} created successfully")
                        if ( row['Type'] and row['Description'] and row['Year']):
                            print ( "Type :" , row['Type'], " Description " ,row['Description'] , " Year : " , row['Year'])
                            Education.objects.create(
                                employee = employee,
                                Type =row['Type'],
                                Description =row['Description'],
                                Year =row['Year'])
                            print ("Employee Education created:")
            return Response({'message': 'Data imported successfully'}, status=status.HTTP_201_CREATED)    
        except Exception as e: 
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDeleteAPI(generics.RetrieveDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = "EmployeeID"

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({"msg": "Employee Deleted"})
        except Employee.DoesNotExist:
            return Response({"msg": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

class EducationViewSet(ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer       