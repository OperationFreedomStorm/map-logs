const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function(zoom) {
        return Math.pow(2, zoom);
    },
    zoom: function(sc) {
        return Math.log(sc) / 0.6931471805599453;
    },
    distance: function(pos1, pos2) {
        var x_difference = pos2.lng - pos1.lng;
        var y_difference = pos2.lat - pos1.lat;
        return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
    },
    transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
    infinite: true
});

var SateliteStyle = L.tileLayer('mapStyles/styleSatelite/{z}/{x}/{y}.jpg', {minZoom: 0,maxZoom: 8,noWrap: true,continuousWorld: false,attribution: 'www.gtamap.xyz',id: 'SateliteStyle map',}),
    AtlasStyle  = L.tileLayer('mapStyles/styleAtlas/{z}/{x}/{y}.jpg', {minZoom: 0,maxZoom: 5,noWrap: true,continuousWorld: false,attribution: 'www.gtamap.xyz',id: 'styleAtlas map',}),
    GridStyle   = L.tileLayer('mapStyles/styleGrid/{z}/{x}/{y}.png', {minZoom: 0,maxZoom: 5,noWrap: true,continuousWorld: false,attribution: 'www.gtamap.xyz',id: 'styleGrid map',});

var ExampleGroup = L.layerGroup();

var Icons = {
    "Example" :ExampleGroup,
};

var mymap = L.map('map', {
    crs: CUSTOM_CRS,
    minZoom: 1,
    maxZoom: 5,
    Zoom: 5,
    maxNativeZoom: 5,
    preferCanvas: true,
    layers: [SateliteStyle, Icons["Example"]],
    center: [0, 0],
    zoom: 3,
});

var layersControl = L.control.layers({ "Satelite": SateliteStyle,"Atlas": AtlasStyle,"Grid":GridStyle}).addTo(mymap);

function customIcon(icon){
    return L.icon({
        iconUrl: `blips/${icon}.png`,
        iconSize:     [30, 30],
        iconAnchor:   [20, 20],
        popupAnchor:  [-10, -27]
    });
}

var marker;
mymap.on('click', function (e) {
    if (marker) { // check
        mymap.removeLayer(marker); 
    }
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    var zoom = 16;
    marker = new L.marker([lat,lng]).addTo(Icons["Example"]).bindPopup("<b>X: "+lng.toFixed(3)+" | Y: "+lat.toFixed(3)+"</b>");
    mymap.setView([lat, lng], zoom);
    mymap.removeLayer(azurirajmarker);
});

var azurirajmarker;

$("#formular").submit(function( event ) {
    event.preventDefault();
    if ($.trim($("#xinput").val()) === "" || $.trim($("#yinput").val()) === "") {
        alert('Please fill X and Y coords');
        return false;
    }
  
    mymap.eachLayer((layer) => {
        if(layer['_latlng']!=undefined)
            layer.remove();
    });
  
    var zoom = 16;
    var xpoz = parseFloat(getParameterByName('x'));
    var ypoz = parseFloat(getParameterByName('y'));
    azurirajmarker = new L.marker([ypoz, xpoz]).addTo(Icons["Example"]).bindPopup("<b>X: "+xpoz.toFixed(3)+" | Y: "+ypoz.toFixed(3)+"</b>");
    mymap.setView([ypoz, xpoz], zoom); 
    $("#markerSkripta").empty().append("<script>"+azurirajmarker+"</script>");
});

function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function() {
    const xCoord = getParameterByName('x');
    const yCoord = getParameterByName('y');
    if (xCoord && yCoord) {
        $('#xinput').val(xCoord);
        $('#yinput').val(yCoord);
        $('#formular').submit();
    }
});
