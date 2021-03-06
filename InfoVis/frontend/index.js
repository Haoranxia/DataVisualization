import * as d3 from "https://cdn.skypack.dev/d3@7";
import { initTable, updateSongTable, getTopGenresRanking, topGenreTable} from "./genresongtable.js";
import { createRadarChart } from "./radar-chart.js";
import { buildForceGraph } from "./forcegraph.js";

// Common data that is used by the graphs
var currentPlaylist;
var currentlySelectedSongs = []

// Extract statistics 
function extractStatistics(songs) {
    var stats = [];
    // Data format must be:
    // {
    //     axis: "statname", value: "value"
    // }
    for (var song in songs) {
        stats.push([
            {axis: "energy", value: songs[song].statistics.energy },
            {axis: "valence", value: songs[song].statistics.valence },
            {axis: "acousticness", value: songs[song].statistics.acousticness },
            {axis: "danceability", value: songs[song].statistics.danceability },
            {axis: "speechiness", value: songs[song].statistics.speechiness }
        ]);
    }

    return stats;
}

export function drawRadarChart(selectedSongs) {
    // TODO: Display some basic info of the selected songs

    var songsStats = extractStatistics(selectedSongs);
    
    document.getElementById("songname1").innerHTML = selectedSongs[0].song_name;
    document.getElementById("songname2").innerHTML = selectedSongs[1].song_name;
    createRadarChart(songsStats);
}

function createDropdownMenu(playlists) {
    // Add playlist names in the dropdown menu
    const getName = p => p.name;
    d3.select("#playlists")
        .selectAll("li")
        .data(playlists.map(playlist => playlist.name))
        .join("li")
            .append("a")
                .attr("class", "dropdown-item")
                .attr("href", "#")
                .text(d => {
                    if (d.length > 25) {
                        return `${d.slice(0, 25)}...`;
                    } else {
                        return d;
                    }
                })
                .on("click", function(e, d) {
                    currentPlaylist = playlists[playlists.map(getName).indexOf(d)];
                    if (d.length > 20) {
                        d3.select("#dropdownMenuButton1")
                            .text(`Selected Playlist: ${d.slice(0, 20)}...`);
                    } else {
                        d3.select("#dropdownMenuButton1")
                        .text(`Selected Playlist: ${d}`);
                    }
                    
                    // Reset playlist data when changing playlists
                    currentlySelectedSongs = [currentPlaylist.songs[0], currentPlaylist.songs[1]];
                    
                    // Remake visualizations
                    updateSongTable(currentlySelectedSongs, currentPlaylist);

                    let genreRanking = getTopGenresRanking(currentPlaylist)
                    topGenreTable(genreRanking, currentPlaylist);

                    drawRadarChart(currentlySelectedSongs);

                    buildForceGraph(currentPlaylist);
                });

    d3.select("#dropdownMenuButton1")
        .text(`Selected Playlist: ${playlists.map(getName)[0]}`);
}

function main() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    // Structure json data 
    $.getJSON("playlists_data.json", (json) => {
        var playlists = json;

        // Create dropdown menu
        createDropdownMenu(playlists);
        
        // Default table values
        currentPlaylist = json[0];
        currentlySelectedSongs.push(currentPlaylist.songs[0]);
        currentlySelectedSongs.push(currentPlaylist.songs[1]);

        // Draw song table
        initTable('#songtable', ["Track", "Artist"]);
        updateSongTable(currentlySelectedSongs, currentPlaylist);
        
        // Draw radar chart
        var songsStats = extractStatistics(currentlySelectedSongs);
        createRadarChart(songsStats);
        drawRadarChart(currentlySelectedSongs);
        
        // Draw genre table
        initTable('#genretable', ["Ranking", "Genre"]);
        let genreRanking = getTopGenresRanking(currentPlaylist)
        topGenreTable(genreRanking, currentPlaylist);

        buildForceGraph(currentPlaylist);
    });
}

main();




