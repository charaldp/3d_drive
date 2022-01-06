@extends('layouts.app_simple')
@section('content')
<rim-editor
    :material_types="{{json_encode(App\Models\Fabrication\Material::material_types())}}"
    :material="{{json_encode($material)}}"
>
</rim-editor>
@endsection

