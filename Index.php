<?php //差旅E行
namespace app\admino\controller;

use app\index\model\TMCUserModel;
use app\index\model\TMCCompanyModel;
use think\Exception;
use think\exception\PDOException;

class Index extends \think\Controller
{
  private $db_company;
  private $db_user;

  protected function initialize()
  {
    parent::initialize();
    $this->db_user = new TMCUserModel();
    $this->db_company = new TMCCompanyModel();
  }

  public function index()
  {
    // return $this->fetch();
    header("Location: /fx/index.php/admino/index/login");
    return "";
  }

  public function login()
  {
    return $this->fetch();
  }

  public function main()
  {
    return $this->fetch();
  }

  public function home()
  {
    return $this->fetch();
  }

  public function formcopy()
  {
    $data = input();
    if (empty($data) || empty($data["id"])) {
      return jsonx(['Code' => 500, 'Message' => 'ID为空或没有数据', 'Result' => [], "input" => input()]);
    }
    $one = db("form")->find($data['id']);
    if (empty($one)) {
      return jsonx(['Code' => 500, 'Message' => '没有找到要复制的数据', 'Result' => [], "input" => input()]);
    }
    $one['id'] = "";
    if ($inid = db("form")->insertGetId($one)) {
      return jsonx(['Code' => 200, 'Message' => '复制成功', 'Result' => ["inid" => $data["inid"]]]);
    } else {
      return jsonx(['Code' => 500, 'Message' => '写入失败', 'Result' => [], "input" => input()]);
    }

  }

  public function formlist()
  {
    $sid = input("sid", "", "trim");
    $did = input("did", "", "trim");
    $db = db("form")->field('*');
    if (!empty($sid)) {
      $db->where("scope_id", $sid);
    }
    if (!empty($did)) {
      $db->where("data_id", $did);
    }
    $list = $db->order("id desc")->paginate(20);
    return jsonx(['Code' => 200, 'Message' => '成功', 'Result' => $list, "input" => input()]);
  }

  public function formdelete()
  {
    $id = input("id", "", "trim");
    if (empty($id)) {
      return jsonx(['Code' => 500, 'Message' => 'ID不能为空', 'Result' => [], "input" => input()]);
    }
    if (db("form")->delete($id)) {
      return jsonx(['Code' => 200, 'Message' => '删除成功', 'Result' => []]);
    } else {
      return jsonx(['Code' => 500, 'Message' => '删除失败', 'Result' => []]);
    }
  }

  public function formadd()
  {
    $data = input();
    if (empty($data['id'])) {
      if (db("form")->insert($data)) {
        return jsonx(['Code' => 200, 'Message' => '添加成功', 'Result' => []]);
      } else {
        return jsonx(['Code' => 500, 'Message' => '添加失败', 'Result' => []]);
      }
    } else {
      if (db("form")->update($data)) {
        return jsonx(['Code' => 200, 'Message' => '修改成功', 'Result' => []]);
      } else {
        return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => []]);
      }
    }
  }


  public function scopeChange()
  {
    $data = input();
    if (empty($data) || empty($data["id"])) {
      return jsonx(['Code' => 500, 'Message' => 'ID为空或没有数据', 'Result' => [], "input" => input()]);
    }
    if ($data["open"] == "true" || $data["open"] == true) {
      $data["open"] = 1;
    } else {
      $data["open"] = 0;
    }
    if (db("scope")->update($data)) {
      return jsonx(['Code' => 200, 'Message' => '修改成功', 'Result' => []]);
    } else {
      return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => [], "input" => input()]);
    }
  }


  public function scopecopy()
  {
    $data = input();
    if (empty($data) || empty($data["id"])) {
      return jsonx(['Code' => 500, 'Message' => 'ID为空或没有数据', 'Result' => [], "input" => input()]);
    }
    $one = db("scope")->find($data['id']);
    if (empty($one)) {
      return jsonx(['Code' => 500, 'Message' => '没有找到要复制的数据', 'Result' => [], "input" => input()]);
    }
    $one['id'] = "";
    if ($inid = db("scope")->insertGetId($one)) {
      $scope = input("scopes");
      if (is_array($scope)) {
        foreach ($scope as $key => $val) {
          $scope[$key]["sid"] = $inid;
          unset($scope[$key]["id"]);
        }
        db("scopes")->insertAll($scope);
      }
      return jsonx(['Code' => 200, 'Message' => '复制成功', 'Result' => ["inid" => $data["inid"]]]);
    } else {
      return jsonx(['Code' => 500, 'Message' => '写入失败', 'Result' => [], "input" => input()]);
    }
  }

  public function scopelist()
  {
    $db = db("scope")->field('*');
    $list = $db->order("id desc")->paginate(20)->toArray();
    // print_r($list);
    if (is_array($list["data"])) {
      foreach ($list["data"] as $key => $val) {
        if ($val["open"] > 0) {
          $list["data"][$key]["open"] = true;
        } else {
          $list["data"][$key]["open"] = false;
        }

        try {
          $list["data"][$key]["scopes"] = db("scopes")->cache("scopes_" . $val["id"], 86400)->where("sid", $val["id"])->all();
        } catch (Exception\DbException $e) {
          $list["data"][$key]["scopes"] = $e->getMessage();
        }


      }
    }
    return jsonx(['Code' => 200, 'Message' => '成功', 'Result' => $list, "input" => input()]);
  }

  public function scopedelete()
  {
    $id = input("id", "", "trim");
    if (empty($id)) {
      return jsonx(['Code' => 500, 'Message' => 'ID不能为空', 'Result' => [], "input" => input()]);
    }
    if (db("scope")->delete($id)) {
      return jsonx(['Code' => 200, 'Message' => '删除成功', 'Result' => []]);
    } else {
      return jsonx(['Code' => 500, 'Message' => '删除失败', 'Result' => []]);
    }
  }

  public function scopeadd()
  {
    $data = input();
    $scope = input("scope");
    unset($data["scope"]);
    unset($data["scopes"]);
    unset($data["\$index"]);
    unset($data["atime"]);

    if (empty($data)) {
      return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => []]);
    }
    $sid = $data['id'];
    if (empty($data['id'])) {
//            return jsonx(['Code' => 200, 'Message' => '添加成功', 'Result' => $data,'res'=>$scope]);
      if ($sid = db("scope")->insertGetId($data)) {
        // TODO 添加关联表的信息
        if (is_array($scope)) {
          foreach ($scope as $key => $val) {
            $scope[$key]["sid"] = $sid;
          }
          db("scopes")->insertAll($scope);
        }
        return jsonx(['Code' => 200, 'Message' => '添加成功', 'Result' => []]);
      } else {
        return jsonx(['Code' => 500, 'Message' => '添加失败', 'Result' => []]);
      }
    } else {
      try {
        if (db("scope")->update($data)) {
          try {
            db("scopes")->where("sid", $sid)->delete();
            cache("scopes_" . $sid, null);
            if (is_array($scope)) {
              foreach ($scope as $key => $val) {
                $scope[$key]["sid"] = $sid;
              }
              db("scopes")->insertAll($scope);
            }
          } catch (PDOException $e) {
            return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => $e->getMessage(), "res" => $scope]);
          } catch (Exception $e) {
            return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => $e->getMessage(), "res" => $scope]);
          }
          return jsonx(['Code' => 200, 'Message' => '修改成功', 'Result' => []]);
        } else {
          return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => []]);
        }
      } catch (PDOException $e) {
        return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => $e->getMessage(), "res" => $data]);
      } catch (Exception $e) {
        return jsonx(['Code' => 500, 'Message' => '修改失败', 'Result' => $e->getMessage(), "res" => $data]);
      }
    }
  }

  public function getEnterprise()
  {
    $key = input("key");

    if (is_numeric($key)) {
      $one = $this->db_company->cache(86400)->field("id,shortname")->where("id", $key)->limit(20)->all();
    } else {
      $one = $this->db_company->cache(86400)->field("id,shortname")->where("customer_fullName", "like", "%$key%")->limit(20)->all();
    }
    return jsonx(['Code' => 200, 'Message' => '', 'Result' => $one]);
  }


  public function getuser()
  {
    $key = input("key");

    if (is_numeric($key)) {
      $one = $this->db_user->cache(86400)->field("id,username,staff_name")->where("id", $key)->limit(20)->all();
    } else {
      $one = $this->db_user->cache(86400)->field("id,username,staff_name")->where("username", "like", "%$key%")->whereOr("staff_name", "like", "%$key%")->limit(20)->all();
    }
    return jsonx(['Code' => 200, 'Message' => '', 'Result' => $one]);
  }


}
