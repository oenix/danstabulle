<?php

namespace DTB\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface; 
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);        
    }

    public function getName()
    {
        return 'dtb_user_registration';
    }
}
?>
