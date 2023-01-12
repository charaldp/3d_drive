class Engine {
  constructor ( shaft_inertia, rev_limit, idle_rot, maximum_hp, has_forced_induction = true ) {
    this._isOn = false;
    this._rot = 0;
    this._idle_rot = idle_rot;
    this._rev_limit = rev_limit;
    this._shaft_inertia = shaft_inertia;
    this._has_forced_induction = has_forced_induction;
    this._forced_induction_factors = {
        0.50: 1.0,
        0.55: 1.05,
        0.60: 1.1,
        0.65: 1.18,
        0.70: 1.28,
        0.75: 1.40,
        0.80: 1.54,
        0.85: 1.70,
        0.90: 1.88,
        0.95: 2.08,
        1.00: 2.30,
    };
    this._currentPower = 0;
    this._currentTorque = 0;
    this._maximumHP = maximum_hp;
    this._load_inertia = 0;
    this.forced_induction_factors_keys = Object.keys(this._forced_induction_factors);
    this.forced_induction_factor = 1;
  }

  updateEngineState( throttle, timestep, handleLoadState ) {
    if (this._rot <= 0) this._rot = 0.001;
    if (this._has_forced_induction && (this._rot / this._rev_limit > 0.5)) {
        let key = Math.floor(10 * this._rot / this._rev_limit) / 10;
        this.forced_induction_factor = this._forced_induction_factors.hasOwnProperty(key)?this._forced_induction_factors[key]:1;
    } else {
        this.forced_induction_factor = 1;
    }
    this._currentPower = this.forced_induction_factor * ( throttle * Math.pow(this._rot / this._idle_rot, 1.2 ) - Math.pow(this._rot / this._idle_rot, 1.3)) * this._maximumHP * this._idle_rot / this._rev_limit;
    // if ( this._currentPower > this._maximumHP ) this._currentPower = this._maximumHP;
    this._currentTorque = this._rot < 2 ? (throttle > 1.2 ? 50 : (this._rot < 0 ? 0 : -1000)) : 118.675 * this._currentPower / this._rot;
    this._rot += timestep * this._currentTorque / (this._shaft_inertia + ( handleLoadState ? this._load_inertia : 0 ) );// N * m / ( kg * m ^ 2 ) = N / (kg * m);
    // console.log(this._currentPower, this._currentTorque, this._shaft_inertia, this._load_inertia, this._rot, this._clutch, timestep);
    if (this._rot > this._rev_limit) this._rot -= 2 * Math.random() * (this._rot - this._rev_limit);
    if (this._rot <= 0) this._rot = 0.001;
  }


}
export default {Engine};
