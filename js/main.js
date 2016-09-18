// Configurable table header
var tableHeaders = [{
  name: 'First name',
  source: 'first_name'
}, {
  name: 'Last name',
  source: 'last_name'
}, {
  name: 'Email',
  source: 'email'
}, {
  name: 'Role',
  source: 'role'
}, {
  name: 'Department',
  source: 'department'
}];
// Search parameters
var defaultOptions = {
  page: 1,
  pageSize: 10,
  ordering: 'user_id',
  desc: false,
  query: ''
}
var options = jQuery.extend({}, defaultOptions);
var usersList = [];
var tableChanged = false;
var calculateAge = function (birthday) 
{
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var setTable = function(users) {
  $('.table-row').remove();
  for (var i in users) {
    var user = users[i];
    var $tr = $('<tr class="table-row" data-id="' + user.user_id + '"></tr>');
    for (var j in tableHeaders) {
      var header = tableHeaders[j];
      $tr.append('<td>' + user[header.source] + '</td>')
    }
    $('#users-table').append($tr);
  }
}

var setPagination = function(options, number) {
  var maxPage = parseInt(number / options.pageSize) + 1;
  $('#currentPage').html(options.page);
  $('#maxPage').html(maxPage);
  $('.pagination-link').removeClass('invisible');
  if (maxPage == options.page) {
    $('#next').addClass('invisible');
  }
  if (options.page == 1) {
    $('#previous').addClass('invisible');
  }
}

var loadData = function(options) {
  $.ajax({
    method: 'post',
    dataType: "json",
    url: 'api/users',
    data: options,
    success: function(data) {
      usersList = data.users;
      setTable(data.users);
      setPagination(options, data.number);
    }
  });
}

var initialHeader = function() {
  var $tr = $('<tr class="table-head-row"></tr>');
  for (var i in tableHeaders) {
    var header = tableHeaders[i];
    $tr.append('<th class="table-header" data-name="' + header.source +'">'+ header.name +
      '<span class="pull-right order-icon glyphicon"></span></th>');
  }
  $('#users-table .table-head-row').remove();
  $('#users-table').prepend($tr);
  $('.table-header').click(function(){
    var name = $(this).data('name');
    options.desc = options.ordering == name ? !options.desc : false; // trigger desc if the order is seleted
    options.ordering = name;
    $('.order-icon').removeClass('glyphicon-sort-by-alphabet glyphicon-sort-by-alphabet-alt');
    var $icon = $(this).children('.order-icon');
    if (options.desc) {
      $icon.addClass('glyphicon-sort-by-alphabet-alt');
    }
    else {
      $icon.addClass('glyphicon-sort-by-alphabet');
    }
    loadData(options);
  });
}

$('#previous').click(function() {
  options.page--;
  loadData(options);
  return false;
});
$('#next').click(function() {
  options.page++;
  loadData(options);
  return false;
});
$('#reset').click(function() {
  options = jQuery.extend({}, defaultOptions);
  initialHeader();
  loadData(options);
});
$('.pagination-size').click(function(e) {
  options = jQuery.extend({}, defaultOptions);
  options.pageSize = $(this).html();
  $('#result-per-page').html(options.pageSize);
  loadData(options);
  e.preventDefault();
});

var searchBarTimer;

var searchByKeyword = function(query) {
  clearTimeout(searchBarTimer);
  options = jQuery.extend({}, defaultOptions);
  options.query = query;
  loadData(options);
  tableChanged = false;
}
$('#search-input').on('input propertychange', function() {
  initialHeader();
  tableChanged = true;
  clearTimeout(searchBarTimer);
  var query = $('#search-input').val();
  if (query.length > 2) {
    searchBarTimer = setTimeout(function(){
      searchByKeyword(query);
    }, 1500);
  }
  if (query.length == 0){
    searchByKeyword(query);
  }
});
$('#search-input').on('blur', function() {
  var query = $(this).val();
  tableChanged && searchByKeyword(query);
});
$('#search-input').keypress(function(e){
  if(e.which == 13) {
    var query = $(this).val();
    tableChanged && searchByKeyword(query);
  }
})
// Display user detail
$(document).delegate('.table-row', 'click', function() {
  var id = $(this).data('id');
  for (var i in usersList) {
    var user = usersList[i];
    if (user.user_id == id) {
      Object.keys(user).forEach(function(key) {
        $('#user-'+key).html(user[key]);
      });
      $('#user-age').html(calculateAge(new Date(user.dob)));
      return $('#userDetail').modal('show');
    }
  }
});

// Initial functions
(function() {
  initialHeader();
  loadData(defaultOptions);
}())
