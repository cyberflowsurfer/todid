/**
 * Unit Test for: todid.goal
 * Date:          Fri Aug 29 21:00:10 2014
 */

describe( 'GoalsCtrl', function() {
  var scope, httpBackend;

  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('todid'));

  //mock the controller and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_){
    //create an empty scope
    scope = $rootScope.$new();

    scope.httpBackend = _$httpBackend_;
    scope.httpBackend.expect('GET', '../goals.json').respond([
  {"id":1,"name":"Learn Rails4 with AspectJ","category":"personal","description":"I want to leverage JavaScript client technologies with Rails","created_at":"2014-08-28T00:00:00.000Z","updated_at":"2014-08-28T00:00:00.000Z"},
  {"id":2,"name":"Learn Nutanix","category":"work","description":"I want to learn about the Nutanix hyperconverged appliance","created_at":"2014-08-28T00:00:00.000Z","updated_at":"2014-08-28T00:00:00.000Z"}
    ]);

    //declare the controller and inject our empty scope
    $controller('GoalsCtrl', {$scope: scope});
  }));

  // tests start here

  it('Has two goals defined', function(){
    scope.$digest();
    scope.httpBackend.flush();
    expect(scope.goals.length).toEqual(2);
  });

  it('First goals\'s category is \'personal\'', function(){
    scope.$digest();
    scope.httpBackend.flush();
    expect(scope.goals[0].category).toEqual('personal');
  });

});
