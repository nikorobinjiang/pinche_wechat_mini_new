from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30,default='')
    password = models.CharField(max_length=100,default='')
    wx_openid = models.CharField(max_length=100,default='',unique=True)
    unionid = models.CharField(max_length=100,default='')
    nickName = models.CharField(max_length=100,default='')
    phone = models.CharField(max_length=30,default='')
    avatarUrl = models.TextField(max_length=200,default='')
    gender = models.CharField(max_length=2,default='')
    language = models.CharField(max_length=10,default='')
    city = models.CharField(max_length=10,default='')
    province = models.CharField(max_length=10,default='')
    country = models.CharField(max_length=15,default='')
    session_key = models.CharField(max_length=100,default='')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)


class TripInfo(models.Model):
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    departure = models.CharField(max_length=30,default='')
    destination = models.CharField(max_length=30,default='')
    leave_date = models.DateField(null=True)
    leave_time = models.TimeField(null=True)
    seats_count = models.PositiveSmallIntegerField(default=0,null=True)
    people_count = models.PositiveSmallIntegerField(default=0,null=True)
    vehicle = models.CharField(max_length=20,default='')
    pc_type = models.CharField(max_length=2,default='1',help_text = '1-找车 2-找人')
    demo = models.TextField(default='',null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2,null=True)
    status = models.CharField(max_length=20,default='',null=True)
    contact_phone = models.CharField(max_length=30,default='',null=True)
    contact_wechat_account = models.CharField(max_length=50,default='',null=True)
    contact_gender = models.CharField(max_length=2,default='',null=True)
    contact_name = models.CharField(max_length=30,default='',null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
    deleted_at = models.DateTimeField(null=True,default=None)
    isAgree = models.CharField(max_length=10,null=True,default=None)

class HotTripSearch(models.Model):
    departure = models.CharField(max_length=30,default='',null=True)
    destination = models.CharField(max_length=30,default='',null=True)
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    show = models.CharField(max_length=2,default='',null=True)
    deleted_at = models.DateTimeField(null=True,default=None)
    
class TripDemoExamples(models.Model):
    content = models.CharField(max_length=255,default='',null=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    show = models.CharField(max_length=2,default='',null=True,help_text = '1-找车 2-找人 3-全部')
    deleted_at = models.DateTimeField(null=True,default=None)
