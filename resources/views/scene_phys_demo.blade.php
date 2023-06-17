@extends('layouts.app_simple')

@section('content')
<scene-simple :json="{{App\Models\Vehicle\Car::$vehicle_example}}"></scene-simple>
@endsection
