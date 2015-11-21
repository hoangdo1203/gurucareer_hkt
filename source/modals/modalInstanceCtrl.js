/**
 * ModalInstanceCtrl
 * Author : TrucHV
 */

app.controller('modalInstanceCtrl', function ($scope, $modalInstance, data) {
  $scope.datas 	= data.datas;
  $scope.kid_id = data.kid_id;
  
  $scope.selected = {
    item: $scope.kid_id
  };

  /*$scope.ok = function () {
	  $modalInstance.close($scope.selected.item);
  };*/
  
  $scope.cancel = function () {
	  $modalInstance.dismiss('cancel');
  };
});