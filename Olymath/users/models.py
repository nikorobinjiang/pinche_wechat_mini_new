from django.db import models

# Create your models here.
class Users(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=255)
    wx_openid = models.CharField(max_length=255)
    wx_nickname = models.CharField(max_length=100)
    phone = models.CharField(max_length=30)
