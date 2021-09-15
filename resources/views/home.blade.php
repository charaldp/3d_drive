@extends('layouts.app_simple')

@section('content')
<div class="container">
    <scene-component :json="{{App\Models\Car::$vehicle_example}}"></scene-component>
</div>
@endsection
