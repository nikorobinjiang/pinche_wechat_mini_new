# Generated by Django 2.1.5 on 2019-03-03 09:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_main', '0008_auto_20190301_1259'),
    ]

    operations = [
        migrations.AddField(
            model_name='hottripsearch',
            name='show',
            field=models.CharField(default='', max_length=2, null=True),
        ),
    ]