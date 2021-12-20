@extends('layouts.app')

@section('content')
{{-- <scene-component :json="{{App\Models\Car::$vehicle_example}}"></scene-component> --}}

<table>
    <tr><th>Rims</th></tr>
    @foreach($user->rims as $rim)
    <tr>
        <td>{{$rim->id}}</td>
        <td>{{$rim->name}}</td>
    </tr>
    @endforeach
    <button class="brn btn-success" href="{{route('rim.create')}}">Create Rim</button>
</table>
<table>
    <tr><th>Tires</th></tr>
    @foreach($user->tires as $tire)
    <tr>
        <td>{{$tire->id}}</td>
        <td>{{$tire->name}}</td>
    </tr>
    @endforeach
</table>
<table>
    <tr><th>Wheels</th></tr>
    @foreach($user->wheels as $wheel)
    <tr>
        <td>{{$wheel->id}}</td>
        <td>{{$wheel->name}}</td>
    </tr>
    @endforeach
</table>
<table>
    <tr><th>Cars</th></tr>
    @foreach($user->cars as $car)
    <tr>
        <td>{{$car->id}}</td>
        <td>{{$car->name}}</td>
    </tr>
    @endforeach
</table>
<table>
    <tr><th>Engines</th></tr>
</table>
@endsection
