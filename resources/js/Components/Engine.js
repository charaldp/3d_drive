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
        0.525: 1.03,
        0.55: 1.05,
        0.575: 1.08,
        0.60: 1.1,
        0.625: 1.15,
        0.65: 1.18,
        0.675: 1.23,
        0.70: 1.28,
        0.725: 1.35,
        0.75: 1.40,
        0.775: 1.48,
        0.80: 1.54,
        0.825: 1.63,
        0.85: 1.70,
        0.875: 1.79,
        0.90: 1.88,
        0.925: 1.99,
        0.95: 2.08,
        0.975: 2.2,
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
    if (this._has_forced_induction && (this._rot / this._rev_limit < 0.5)) {
        this.forced_induction_factor = 1;
    } else if (this._rot / this._rev_limit <= 1) {
        let key = Math.ceil(40 * this._rot / this._rev_limit) / 40;
        this.forced_induction_factor = this._forced_induction_factors[key];
    } else {
        this.forced_induction_factor = 0.00001;
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
