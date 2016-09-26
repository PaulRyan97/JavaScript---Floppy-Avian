#!/usr/local/bin/python3

from cgitb import enable
enable()


from cgi import FieldStorage, escape
import pymysql as db

print('Content-Type: text/html')
print()

result = ""
username = ""
points = 0
leaderboard = ""
form_data = FieldStorage()

try:
    connection = db.connect('local@host','user', 'password', 'id')
    cursor = connection.cursor(db.cursors.DictCursor)
    leaderboard = '<table id="table"><tr><th>Player Name</th><th colspan="2">Score</th></tr>'
    cursor.execute("""SELECT player_name, score
                      FROM leaderboard
                      ORDER BY score DESC""")
    for row in cursor.fetchall():
        leaderboard += '<tr><td colspan="2">%s</td><td>%s</td></tr>' % (row['player_name'], row['score'])
    leaderboard += '</table>'
    cursor.close()
    connection.close()
except db.Error:
    result = """Unable to access leaderboard. We have dispatched a team of highly skilled naked
                mole rats to fix the issue."""


if len(form_data) != 0:
    try:
        name = escape(form_data.getfirst('username','').strip())
        points = form_data.getfirst('points')
        connection = db.connect('local@host','user', 'password', 'id')
        cursor = connection.cursor(db.cursors.DictCursor)
        cursor.execute("""INSERT INTO leaderboard(player_name, score)
                            VALUES(%s, %s );""", (name, points))
        connection.commit()
        cursor.close()
        connection.close()
    except db.Error:
        result = """Sorry, we are currently undergoing a period of scheduled maintenance&po.
                 We are unable to record your results at this time."""

print("""
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Flappy Bird? Never heard of it.</title>
     <script src="game.js"></script>
     <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
     <script>
     $(document).ready(function(){
    $("#toggle").click(function(){
        $("#scores").slideToggle("slow");
        $('html, body').animate({
                        scrollTop: $("#scores").offset().top
                    }, 1000);
    });
    });
    </script>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="game.css">
    <style>
    #scores, #toggle {
    padding: 5px;
    text-align: center;
    background-color: #D8D8D8;
    border: solid 1px #A8A8A8;
    }
    #scores {
    padding: 50px;
    display: none;
    }
##    jQuery obtained from www.w3schools.com
    </style>
  </head>
  <body>
  <canvas id = "canvas" width = "1400" height = "900"></canvas>
  <form id = "form" action ="floppyavian.py" method="get">
     <input type = "hidden" id = "username" value = "%s" name = "username"><br>
     <input type = "hidden" id = "points" value = "%s" name = "points">
        </form>
        %s
        <div id="toggle">Click to view the current leaderboard</div>
        <div id="scores">%s</div>
  </body>
</html>""" % ( username, points,result, leaderboard ))
