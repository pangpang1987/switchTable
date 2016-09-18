<?php
  require_once('./connect/DBC.php');
  $orders=array('user_id','first_name','last_name', 'email', 'role', 'department'); // simple escaping not orderable column name inputed

  $page = intval($_POST['page']);
  $page_size = intval($_POST['pageSize']);
  $ordering = $_POST['ordering'];
  $desc = $_POST['desc'];
  $query = $_POST['query'];

  $dbc = new DBC();
  $con = $dbc->connect();
  if (in_array($ordering, $orders, true) === FALSE) {
    $ordering = 'user_id';
  }
  if ($desc == 'true') {
    $desc = 'DESC';
  }
  else {
    $desc = 'ASC';
  }

  if (strlen($query) > 0) {
    $select = 'SELECT count(*) ';
    $sql = 'FROM user WHERE '
            .'MATCH first_name AGAINST (:query1) OR '
            .'MATCH last_name AGAINST (:query2) OR '
            .'MATCH email AGAINST (:query3) OR '
            .'MATCH role AGAINST (:query4) OR '
            .'MATCH department AGAINST (:query5)';
    $sth = $con->prepare($select.$sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    
    $querys = array(
      ':query1' => $query,
      ':query2' => $query,
      ':query3' => $query,
      ':query4' => $query,
      ':query5' => $query
    );
    $sth->execute($querys);
    $users_count = $sth->fetchColumn();

    $start = ($page-1) * $page_size;
    $querys[':start'] = $start;
    $querys[':page_size'] = $page_size;
    $sql = 'SELECT * '.$sql."ORDER BY $ordering $desc Limit :start, :page_size";
    $sth = $con->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $sth->execute($querys);
    $users_array = $sth->fetchAll(PDO::FETCH_ASSOC);
  }
  else {
    $users_count = intval($con->query('SELECT count(*) FROM user')->fetchColumn());
    $sql = "SELECT * FROM user ORDER BY $ordering $desc Limit :start, :page_size";
    $start = ($page-1) * $page_size;
    $sth = $con->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $sth->execute(array(':start' => $start, ':page_size' => $page_size));
    $users_array = $sth->fetchAll(PDO::FETCH_ASSOC);
  }
  header('Content-type: application/json');
  $return_result = ['number' => $users_count, 'users' => $users_array];
  echo json_encode($return_result);
  return $dbc->disconnect();
?>
