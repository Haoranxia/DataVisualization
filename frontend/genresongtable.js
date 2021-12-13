import {drawRadarChart} from "./index.js";

function makeTable(titles, data, allsongs, currentlySelectedSongs) {
    let sortAscending = true;
    let table = d3.select('#songtable').append('table');

    // Code for table head 
    var headers = table.append('thead')
        .append('tr')
        .selectAll('th')
        .data(titles).enter()
        .append('th')
        .text((d) => { return d; })
        
        // Sorts the table column alphabetically when clicked on 
        .on('click', (d) => {
            headers.attr('class', 'header');
            if (sortAscending) {
                rows.sort((a, b) => { return b[d] < a[d]; });
                sortAscending = false;
                //this.className = 'aes';
            }
            else {
                rows.sort((a, b) => { return b[d] > a[d]; });
                sortAscending = true;
                //this.className = 'des';
                
            }
        });
    

    // Code for table rows
    var rows = table.append('tbody').selectAll('tr')
        .data(data).enter()
        .append('tr')
        .attr('class', 'clickable-row')
        .attr('id', (d) => {
            // Set the current songs to the song clicked
            return 'row' + data.indexOf(d);
        });
    
    rows.selectAll('td')
        .data((d) => {
            return titles.map((k) => {
                return {name: d, value: d[k] };
            });
        })
        .enter()
        .append('td')
        .text((d) => { return d.value; })
        .on('click', (d) => {
            // Handles connection with the radar chart
            for (var song in allsongs) {
                if (currentlySelectedSongs.length >= 2) {
                    for (var song in allsongs.songs) {
                        if (allsongs.songs[song].song_name == d.value) {
                            currentlySelectedSongs.shift();
                            currentlySelectedSongs.push(allsongs.songs[song]);
                            drawRadarChart();
                            return;
                        }
                    }
                }
                else {
                    for (var song in allsongs.songs) {
                        if (allsongs.songs[song].song_name == d.value) {
                            currentlySelectedSongs.push(allsongs.songs[song]);
                            drawRadarChart();
                            return;
                        }
                    }
                }
            }
        });
    
}


export function createTable(data, currentlySelectedSongs) {
    // Incoming data as JSON 

    /*
    Data must be in CSV like format:
    row0: header1, header2, header3, ...                   } headers
    row1: data.item1, data.item2, dataitem3, ...           } 1 data item
    row2: ...
    */

    let headers = ["track-name", "artist"];
    let songdata = [];
    
    for (const song in data.songs) 
        songdata.push({
            "track-name": data.songs[song].song_name, 
            "artist": data.songs[song].artists
        });

    makeTable(headers, songdata, data, currentlySelectedSongs);
}