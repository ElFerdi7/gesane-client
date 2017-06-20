'use strict';
moduloSistema.controller('NewalumnoController', ['$http', '$scope', '$routeParams', '$location', 'serverService', 'sessionService', '$rootScope',
    function ($http, $scope, $routeParams, $location, serverService, sessionService, $rootScope) {
        $scope.title = "Registro de alumno para el curso " + $routeParams.codigo;
        $scope.isSessionActive = sessionService.isSessionActive();

        $scope.status = null;
        $scope.debugging = serverService.debugging();
        $scope.bean = {};
        $scope.codigoGrupo = $routeParams.codigo;
        $scope.fase = 1;


        //obtener información del profesor y del curso y del centro a partir del código de centro
        $http.get(serverService.getAppUrl() + '?ob=usuario&op=getinfofromcode&code=' + $routeParams.codigo, 'GET', '').then(function (response) {
            if (response.status == 200) {
                if (response.data.message == "OK") {
                    //$scope.outerForm.login.$setValidity('repetido', false);
                    $scope.fase = 2;
                }
            } else {
                //$scope.outerForm.login.$setValidity('repetido', true);
                return false;
            }
        }, function errorCallback(response, status) {
            //$scope.outerForm.login.$setValidity('repetido', true);
            return false;
        });







        $scope.validausuario = function (field) {
            if ($scope.fase == 1) {
                if ($scope.bean.login) {
                    $http.get(serverService.getAppUrl() + '?ob=usuario&op=checklogin&login=' + $scope.bean.login, 'GET', '').then(function (response) {
                        if (response.status == 200) {
                            if (response.data.message == "OK") {
                                //$scope.outerForm.login.$setValidity('repetido', false);
                                $scope.fase = 2;
                            }
                        } else {
                            //$scope.outerForm.login.$setValidity('repetido', true);
                            return false;
                        }
                    }, function errorCallback(response, status) {
                        //$scope.outerForm.login.$setValidity('repetido', true);
                        return false;
                    });
                }
            }
        }
        $scope.checkPass = function () {
            if ($scope.bean.password == $scope.bean.password2) {
                return false;
            } else {
                return true;
            }
        }
        $scope.validaContrasenya = function () {
            $scope.fase = 3;
        }
        $scope.save = function () {
//            $scope.bean.creation = $filter('date')($scope.bean.creation, "dd/MM/yyyy");
//            $scope.bean.modification = $filter('date')($scope.bean.modification, "dd/MM/yyyy");
//            if (!$scope.bean.obj_medico.id > 0) {
//                $scope.bean.obj_medico.id = null;
//            }
            $scope.bean.password2;
            var jsonToSend = {json: JSON.stringify(serverService.array_identificarArray($scope.bean))};
            serverService.promise_setOne('usuario', jsonToSend).then(function (response) {
                if (response.status == 200) {
                    if (response.data.status == 200) {
                        $scope.response = response;
                        $scope.fase = 4;
                        $scope.status = "El usuario se ha creado";
                        $scope.bean.id = response.data.message;
                    } else {
                        $scope.status = "Error en la recepción de datos del servidor";
                    }
                } else {
                    $scope.status = "Error en la recepción de datos del servidor";
                }
            }).catch(function (data) {
                $scope.status = "Error en la recepción de datos del servidor";
            });
            ;
        };
    }
]);

