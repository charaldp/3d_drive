@extends('layouts.app_simple')

@section('content')
{{-- <scene-simple :json="{{App\Models\Vehicle\Car::$vehicle_example}}"></scene-simple> --}}
<scene-component :json="{{App\Models\Vehicle\Car::$vehicle_example}}"></scene-component>
{{-- <scene-component :json="{{App\Models\Vehicle\Motorbike::$vehicle_example}}"></scene-component> --}}
{{-- <div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                </div>
            </div>
        </div>
    </div>
</div> --}}
@endsection
