# Generated by Django 2.1.5 on 2019-03-21 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_main', '0010_auto_20190318_1117'),
    ]

    operations = [
        migrations.AddField(
            model_name='tripinfo',
            name='isAgree',
            field=models.CharField(default=None, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='tripinfo',
            name='contact_gender',
            field=models.CharField(default='', max_length=2, null=True),
        ),
    ]