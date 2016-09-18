<?php

class DBC {
  private $con;
  public function __construct() {   
  }
  public function connect() {
   try {
      $conf = include(dirname(__DIR__).'/config/base.php');
      $local_conf = include(dirname(__DIR__).'/config/local.php');
      foreach($local_conf as $key => $value) {
        $conf[$key] = $value;
      }
      $this->con = new PDO($conf['driver'].
        ':host='.$conf['host'].
        '; dbname='.$conf['database'].
        '; port='.$conf['port'],
        $conf['username'],
        $conf['password']);  
      $this->con->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
      $this->con->setAttribute( PDO::ATTR_EMULATE_PREPARES, false );
      $charset = $conf['charset'];
      $this->con->exec("SET CHARACTER SET $charset");
      return $this->con;
    }
    catch (PDOException $err) {
      echo "harmless error message if the connection fails";
      $err->getMessage() . "<br/>";
      die(); 
    }
  }
  function disconnect() {
    $this->con = null;
  }
}
?>
