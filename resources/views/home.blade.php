@extends('layouts.app_simple')

@section('content')
<scene-component :json="{{App\Models\Car::$vehicle_example}}"></scene-component>
@endsection
