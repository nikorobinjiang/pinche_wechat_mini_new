"""Olymath URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

from django.urls import path
from . import view
from app_main import views as app_main_view

urlpatterns = [
    path('', view.hello),
    path('login',view.login),
    path('mini_login',view.miniLogin),
    path('getTripList',app_main_view.getTripList),
    path('trip/create',app_main_view.createOrUpdateTrip),
    path('getHotTrips',app_main_view.getHotTrips),
    path('myTripList',app_main_view.myTripList),
    path('tripDetail',app_main_view.tripDetail)

]
