# -*- coding: utf-8 -*-

with open('view_files/header.txt', 'r') as file:
    header = file.read().replace('\n', '')
    
with open('view_files/body_upper.txt', 'r') as file:
    body_upper = file.read().replace('\n', '')
    
with open('view_files/reader.txt') as file:
    reader = file.read().replace('\n', '')

with open('view_files/body_downer.txt', 'r') as file:
    body_downer = file.read().replace('\n', '')


compiled_html = "<!DOCTYPE html> <html>" + header + body_upper + reader + body_downer + "</html>"

file = open("index.html", "w")
file.write(compiled_html)
file.close()
