from django.urls import path,include
from .views import EmployeeDeleteAPI,EducationViewSet,EmployeeViewSet,EmployeeList,EmployeeUpdateViewSet,ImportAPIView
# ExcelImportViewSet
# ,EmployeeCreateViewSet,EmployeeUpdateViewSet
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('employees/',EmployeeList.as_view({'get': 'list'}),name="Employee"),
    path('employees/create/',EmployeeViewSet.as_view({'post': 'create'}),name="Employee_Create"),
    path('employees/edit/<str:EmployeeID>',EmployeeUpdateViewSet.as_view({'get': 'retrieve','put': 'update'}),name="Employee_Update"),
    path('employees/delete/<str:EmployeeID>',EmployeeDeleteAPI.as_view(),name="Employee_Delete"),
    path('employees/EducationViewSet',EducationViewSet.as_view({'get': 'retrieve'}),name="EducationViewSet"), # path added
    path('employees/ExcelImport/',ImportAPIView.as_view(),name="ImportAPIView")
]


